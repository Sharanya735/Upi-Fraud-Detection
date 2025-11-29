𝐔𝐏𝐈 𝐅𝐫𝐚𝐮𝐝 𝐃𝐞𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐒𝐲𝐬𝐭𝐞𝐦

AI-Driven Fraud Detection Using Hybrid Machine Learning Models

This project presents an intelligent fraud detection system designed for UPI (Unified Payments Interface) transactions. The system uses a hybrid Machine Learning approach that combines supervised learning (Random Forest) and unsupervised anomaly detection (Isolation Forest) to identify suspicious transactions in real time. The solution integrates UPI-specific behavioral features, anomaly scoring, and SHAP-based explainability to deliver accurate and transparent predictions.

🔍 Project Overview

With increasing digital payments, fraud prevention is critical. Traditional rule-based systems struggle with new fraud patterns. Our project addresses this by developing a data-driven AI system that learns transaction behavior, detects anomalies, and outputs an interpretable fraud risk score.

The system is designed to be:

Accurate – hybrid model improves recall on minority fraud cases

Explainable – SHAP values show which features influenced the decision

Deployable – exportable models + API-ready prediction function

UPI-specific – engineered features aligned with real transaction behavior

🧠 Methodology
1. Dataset & Feature Engineering

Input dataset includes:

timestamp, transaction_id, user_id, merchant_id, device_id, amount, location, channel, is_fraud


Engineered features:

Hour & weekday

Transaction velocity (tx_count_24h)

New payee indicator

Device change detection

Log-transformed amount

Encoded categorical features

2. Machine Learning Models

Random Forest (Calibrated) – learns fraud patterns

Isolation Forest – detects unusual behavior

Hybrid Score – weighted fusion for stronger accuracy

3. Explainability

SHAP values identify top features driving the fraud probability

💻 System Architecture

Dataset → Feature Engineering → Train ML Models → Hybrid Scoring → SHAP Explainability → API / UI Integration

Models exported as:

rf_model.joblib  
iso_model.joblib  
scaler.joblib  
encoders.joblib  

⚙️ How to Run

Install dependencies:

pip install -r requirements.txt


Train & export models:

python train_and_export_models_v2.py


Predict a transaction:

from train_and_export_models_v2 import predict_single
predict_single({...})

🎯 Outcomes

Developed a complete end-to-end UPI fraud detection pipeline

Improved recall on minority fraud class using hybrid ML

Provides transparent SHAP-based explanations

Ready for integration with frontend dashboards (Streamlit/React) and APIs

📚 Technologies Used

Python

Pandas, NumPy

Scikit-Learn

SHAP

Joblib

FastAPI
