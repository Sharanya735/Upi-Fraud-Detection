import os
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import shap
import time
import json
from datetime import datetime, timedelta

# Metrics log file (JSON lines)
METRICS_LOG = os.path.join(os.path.dirname(__file__), 'predictions.log')

# Ensure metrics log exists
if not os.path.exists(METRICS_LOG):
    open(METRICS_LOG, 'a').close()

# MODEL PATHS
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
RF_MODEL_PATH = os.path.join(MODEL_DIR, 'rf_model.joblib')
ISO_MODEL_PATH = os.path.join(MODEL_DIR, 'iso_model.joblib')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.joblib')

# FEATURES
FEATURES = ['amount','hour','weekday','tx_count_24h','is_new_payee','device_changed']

# Load artifacts
def load_artifacts():
    rf = joblib.load(RF_MODEL_PATH)
    iso = joblib.load(ISO_MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return rf, iso, scaler

rf, iso, scaler = load_artifacts()

# FastAPI app
app = FastAPI(title="UPI Fraud Detection ML API")

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class TxnInput(BaseModel):
    transaction_id: str = ""
    user_id: str
    merchant_id: str
    device_id: str
    amount: float
    timestamp: str # ISO or yyyy-mm-dd HH:MM:SS
    tx_count_24h: int = 0
    is_new_payee: int = 0
    device_changed: int = 0

# Predict single transaction helper (adapted from your code)
def predict_single(txn: dict):
    start_ts = time.perf_counter()
    df = pd.DataFrame([txn]).copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['weekday'] = df['timestamp'].dt.weekday
    for col in ['tx_count_24h','is_new_payee','device_changed']:
        if col not in df.columns:
            df[col] = 0
    X = df[FEATURES].fillna(0)
    Xs = scaler.transform(X)
    prob = float(rf.predict_proba(Xs)[:,1][0])
    iso_pred = iso.predict(Xs)[0]
    iso_score = 1 if iso_pred == -1 else 0
    alpha = 0.7
    risk_score = alpha * prob + (1 - alpha) * iso_score
    label = int(risk_score > 0.5)
    # SHAP
    try:
        explainer = shap.TreeExplainer(rf)
        shap_values = explainer.shap_values(Xs)
        if isinstance(shap_values, list):
            arr = np.asarray(shap_values[-1])
        else:
            arr = np.asarray(shap_values)
        if arr.ndim == 3:
            arr = arr[-1]
        shap_for_row = arr[0]
    except Exception:
        shap_for_row = np.zeros(len(FEATURES))
    feat_shap_pairs = list(zip(FEATURES, shap_for_row))
    feat_shap_pairs_sorted = sorted(feat_shap_pairs, key=lambda x: abs(x[1]), reverse=True)
    topk = feat_shap_pairs_sorted[:5]
    shap_dict = {k: float(v) for k, v in topk}
    latency_ms = (time.perf_counter() - start_ts) * 1000.0

    # Log prediction for metrics (append JSON line)
    try:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "transaction_id": txn.get('transaction_id', ''),
            "user_id": txn.get('user_id', ''),
            "amount": float(txn.get('amount', 0)),
            "risk_score": float(risk_score),
            "fraud_label": int(label),
            "supervised_prob": float(prob),
            "anomaly_flag": int(iso_score),
            "latency_ms": float(latency_ms)
        }
        with open(METRICS_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception:
        pass

    return {
        "risk_score": float(risk_score),
        "fraud_label": label,
        "supervised_prob": prob,
        "anomaly_flag": iso_score,
        "shap_top_features": shap_dict,
        "latency_ms": latency_ms
    }

@app.post("/predict")
def predict_endpoint(item: TxnInput):
    try:
        txn = item.dict()
        res = predict_single(txn)
        return {"risk_score": res["risk_score"], "fraud_label": res["fraud_label"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/explain")
def explain_endpoint(item: TxnInput):
    try:
        txn = item.dict()
        res = predict_single(txn)
        return {"shap_top_features": res["shap_top_features"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def _read_recent_logs(window_seconds: int = 300):
    """Read the predictions.log and return entries within the last window_seconds."""
    now = datetime.utcnow()
    cutoff = now - timedelta(seconds=window_seconds)
    results = []
    try:
        with open(METRICS_LOG, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                    ts = datetime.fromisoformat(obj.get('timestamp'))
                    if ts >= cutoff:
                        results.append(obj)
                except Exception:
                    continue
    except FileNotFoundError:
        return []
    return results


@app.get('/metrics')
def metrics_endpoint(window_seconds: int = 300):
    """Return aggregated metrics for the last `window_seconds` seconds (default 300s)."""
    logs = _read_recent_logs(window_seconds)
    total = len(logs)
    if total == 0:
        return {
            'window_seconds': window_seconds,
            'transactions': 0,
            'fraud_count': 0,
            'detection_rate': None,
            'avg_latency_ms': None,
            'avg_risk_score': None,
            'anomaly_count': 0,
            'throughput_tps': 0.0,
            'recent_alerts': []
        }

    fraud_count = sum(1 for e in logs if int(e.get('fraud_label', 0)) == 1)
    anomaly_count = sum(1 for e in logs if int(e.get('anomaly_flag', 0)) == 1)
    avg_latency = sum(float(e.get('latency_ms', 0.0)) for e in logs) / total
    avg_risk = sum(float(e.get('risk_score', 0.0)) for e in logs) / total
    detection_rate = (fraud_count / total) * 100.0
    throughput = total / float(window_seconds)

    # recent high-risk alerts (top 5 by risk_score)
    high = sorted([e for e in logs], key=lambda x: float(x.get('risk_score', 0)), reverse=True)[:5]
    recent_alerts = [
        {
            'transaction_id': e.get('transaction_id'),
            'user_id': e.get('user_id'),
            'amount': e.get('amount'),
            'risk_score': e.get('risk_score'),
            'timestamp': e.get('timestamp')
        }
        for e in high
    ]

    return {
        'window_seconds': window_seconds,
        'transactions': total,
        'fraud_count': fraud_count,
        'detection_rate': detection_rate,
        'avg_latency_ms': avg_latency,
        'avg_risk_score': avg_risk,
        'anomaly_count': anomaly_count,
        'throughput_tps': throughput,
        'recent_alerts': recent_alerts
    }
