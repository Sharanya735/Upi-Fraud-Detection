import os
import joblib
import warnings
warnings.filterwarnings("ignore")
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score
import shap

DATA_PATH = "upi_fraud_dataset.csv"  # Place your CSV in project root or change path
OUTPUT_DIR = "./models"
RF_MODEL_PATH = os.path.join(OUTPUT_DIR, "rf_model.joblib")
ISO_MODEL_PATH = os.path.join(OUTPUT_DIR, "iso_model.joblib")
SCALER_PATH = os.path.join(OUTPUT_DIR, "scaler.joblib")

# --- Feature Engineering and Load ---
def load_and_prepare_safe(csv_path):
    df = pd.read_csv(csv_path)

    # Provide flexible mapping for datasets with different column names.
    # If expected columns are missing, try common alternatives from the provided CSV.
    # Map alternatives into the canonical names used by the rest of the script.
    colmap = {}
    if 'timestamp' not in df.columns:
        # Try to assemble a timestamp from separate date/time fields
        if {'trans_year', 'trans_month', 'trans_day', 'trans_hour'}.issubset(df.columns):
            df['timestamp'] = pd.to_datetime(
                df['trans_year'].astype(str) + '-' + df['trans_month'].astype(str) + '-' + df['trans_day'].astype(str) + ' ' + df['trans_hour'].astype(str) + ':00:00',
                errors='coerce'
            )
        else:
            # last resort: try common names
            possible_ts = ['time', 'date', 'datetime']
            found = None
            for p in possible_ts:
                if p in df.columns:
                    df['timestamp'] = pd.to_datetime(df[p], errors='coerce')
                    found = p
                    break
            if found is None:
                raise ValueError("CSV must include a timestamp column or (trans_year, trans_month, trans_day, trans_hour) to build one.")
    else:
        df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    if df['timestamp'].isnull().any():
        raise ValueError("Some 'timestamp' rows could not be parsed to datetime. Check CSV.")
    # Map alternative column names to the canonical ones used downstream
    if 'transaction_id' not in df.columns and 'Id' in df.columns:
        df = df.rename(columns={'Id': 'transaction_id'})
    if 'user_id' not in df.columns and 'upi_number' in df.columns:
        df = df.rename(columns={'upi_number': 'user_id'})
    if 'merchant_id' not in df.columns and 'category' in df.columns:
        df = df.rename(columns={'category': 'merchant_id'})
    if 'device_id' not in df.columns and 'device' in df.columns:
        df = df.rename(columns={'device': 'device_id'})
    # Fallback: if there's no device_id, reuse user_id as device_id placeholder
    if 'device_id' not in df.columns and 'user_id' in df.columns:
        df['device_id'] = df['user_id']
    # Map amount and label fields
    if 'amount' not in df.columns and 'trans_amount' in df.columns:
        df = df.rename(columns={'trans_amount': 'amount'})
    if 'is_fraud' not in df.columns and 'fraud_risk' in df.columns:
        df = df.rename(columns={'fraud_risk': 'is_fraud'})

    df = df.sort_values(['user_id','timestamp']).reset_index(drop=True)
    df['hour'] = df['timestamp'].dt.hour
    df['weekday'] = df['timestamp'].dt.weekday
    df['tx_count_24h'] = 0
    for uid, g in df.groupby('user_id'):
        if g.shape[0] == 0:
            continue
        try:
            s = g.set_index('timestamp')['transaction_id'].rolling('24H').count()
            df.loc[g.index, 'tx_count_24h'] = s.values
        except Exception:
            times = g['timestamp'].tolist()
            counts = []
            for i, t in enumerate(times):
                t0 = t - pd.Timedelta(hours=24)
                cnt = sum((tt >= t0) and (tt <= t) for tt in times)
                counts.append(cnt)
            df.loc[g.index, 'tx_count_24h'] = counts
    df['is_new_payee'] = df.groupby('user_id')['merchant_id'].transform(lambda x: (x != x.shift(1)).astype(int))
    df['is_new_payee'] = df['is_new_payee'].fillna(1).astype(int)
    df['device_changed'] = df.groupby('user_id')['device_id'].transform(lambda x: (x != x.shift(1)).astype(int))
    df['device_changed'] = df['device_changed'].fillna(0).astype(int)
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
    df['tx_count_24h'] = df['tx_count_24h'].astype(int)
    return df

def train_models(df, features, label_col='is_fraud', test_fraction=0.3, random_state=42):
    if label_col not in df.columns:
        raise ValueError(f"Label column '{label_col}' not found in dataframe")
    df_sorted = df.sort_values('timestamp').reset_index(drop=True)
    n = len(df_sorted)
    split_idx = int(n * (1 - test_fraction))
    train_df = df_sorted.iloc[:split_idx].reset_index(drop=True)
    test_df = df_sorted.iloc[split_idx:].reset_index(drop=True)
    X_train = train_df[features].fillna(0)
    y_train = train_df[label_col].astype(int)
    X_test = test_df[features].fillna(0)
    y_test = test_df[label_col].astype(int)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    rf = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=random_state)
    rf.fit(X_train_scaled, y_train)
    y_pred_rf = rf.predict(X_test_scaled)
    y_prob_rf = rf.predict_proba(X_test_scaled)[:,1]
    iso = IsolationForest(contamination=0.03, random_state=random_state)
    iso.fit(X_train_scaled)
    iso_pred_test = iso.predict(X_test_scaled)
    iso_score_test = np.where(iso_pred_test == -1, 1, 0)
    alpha = 0.7
    hybrid_score = alpha * y_prob_rf + (1 - alpha) * iso_score_test
    hybrid_pred = (hybrid_score > 0.5).astype(int)
    print("\n=== Random Forest Evaluation ===")
    print(classification_report(y_test, y_pred_rf, digits=4))
    try:
        print("RF AUC:", round(roc_auc_score(y_test, y_prob_rf), 4))
    except Exception:
        pass
    print("\n=== Hybrid (RF + IsolationForest) Evaluation ===")
    print(classification_report(y_test, hybrid_pred, digits=4))
    try:
        print("Hybrid AUC (approx):", round(roc_auc_score(y_test, hybrid_score), 4))
    except Exception:
        pass
    artifacts = {
        'rf_model': rf,
        'iso_model': iso,
        'scaler': scaler,
        'X_test': X_test,
        'y_test': y_test,
        'y_prob_rf': y_prob_rf,
        'iso_score_test': iso_score_test,
        'hybrid_score': hybrid_score
    }
    return artifacts

def save_artifacts(artifacts, out_dir=OUTPUT_DIR):
    os.makedirs(out_dir, exist_ok=True)
    joblib.dump(artifacts['rf_model'], RF_MODEL_PATH)
    joblib.dump(artifacts['iso_model'], ISO_MODEL_PATH)
    joblib.dump(artifacts['scaler'], SCALER_PATH)
    print("\nSaved artifacts:")
    print(" - RF model ->", RF_MODEL_PATH)
    print(" - IsolationForest ->", ISO_MODEL_PATH)
    print(" - Scaler ->", SCALER_PATH)

if __name__ == "__main__":
    print("Loading and preparing data from:", DATA_PATH)
    df = load_and_prepare_safe(DATA_PATH)
    FEATURES = ['amount','hour','weekday','tx_count_24h','is_new_payee','device_changed']
    if 'is_fraud' not in df.columns:
        raise ValueError("Dataset must contain 'is_fraud' column for supervised training.")
    print("Training models using features:", FEATURES)
    artifacts = train_models(df, FEATURES, label_col='is_fraud', test_fraction=0.3)
    save_artifacts(artifacts)
    print("\nDone. Artifacts saved in ./models/")
