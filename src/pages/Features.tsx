import { Brain, Activity, Shield, TrendingUp, Eye, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Hybrid Machine Learning Model",
      description: "Combines supervised learning (Random Forest, XGBoost) with unsupervised anomaly detection (Isolation Forest) for comprehensive fraud detection coverage."
    },
    {
      icon: Activity,
      title: "UPI-Specific Behavioral Analytics",
      description: "Analyzes transaction patterns including device changes, new payee flags, transaction velocity, time-of-day patterns, and 24-hour activity windows."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Risk Scoring",
      description: "Instant fraud probability assessment with weighted fusion of supervised predictions and anomaly scores for accurate risk evaluation."
    },
    {
      icon: Eye,
      title: "Explainable AI (SHAP)",
      description: "SHAP values provide transparent insights into which features contributed most to fraud predictions, enabling trust and compliance."
    },
    {
      icon: Shield,
      title: "Anomaly Detection Layer",
      description: "Isolation Forest identifies unusual transaction patterns that may indicate new or evolving fraud techniques not seen in training data."
    },
    {
      icon: Bell,
      title: "Analyst Dashboard & Alerts",
      description: "Real-time monitoring dashboard with automated alerts for high-risk transactions, enabling rapid response to potential fraud."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="text-primary"> Fraud Prevention</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our system leverages cutting-edge AI and machine learning techniques to provide 
              comprehensive, real-time fraud detection capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          <div className="mt-16 p-8 rounded-lg border border-border/40 bg-card">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Data Ingestion:</strong> Transaction data including amount, user behavior, device info, and temporal patterns is captured in real-time.
              </p>
              <p>
                <strong className="text-foreground">2. Feature Engineering:</strong> UPI-specific features are extracted including device changes, new payee flags, transaction velocity, and time-based patterns.
              </p>
              <p>
                <strong className="text-foreground">3. Hybrid Prediction:</strong> Both supervised classifiers and anomaly detectors analyze the transaction simultaneously.
              </p>
              <p>
                <strong className="text-foreground">4. Risk Fusion:</strong> Outputs are combined using weighted fusion to produce a final risk score (0-1).
              </p>
              <p>
                <strong className="text-foreground">5. Explainability:</strong> SHAP values highlight which features most influenced the fraud prediction.
              </p>
              <p>
                <strong className="text-foreground">6. Action:</strong> High-risk transactions trigger alerts for analyst review or automated blocking.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
