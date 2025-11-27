import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Cpu, BarChart3, Eye, AlertTriangle } from "lucide-react";

const Architecture = () => {
  const architectureFlow = [
    { icon: Database, label: "Data Ingestion", color: "text-blue-500" },
    { icon: Cpu, label: "Feature Engineering", color: "text-green-500" },
    { icon: BarChart3, label: "Supervised Classifier", color: "text-purple-500" },
    { icon: AlertTriangle, label: "Anomaly Detection", color: "text-orange-500" },
    { icon: Cpu, label: "Hybrid Fusion", color: "text-red-500" },
    { icon: Eye, label: "SHAP Explainability", color: "text-yellow-500" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System <span className="text-primary">Architecture</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              End-to-end workflow of our hybrid machine learning fraud detection system
            </p>
          </div>

          {/* Architecture Flow */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Detection Pipeline</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {architectureFlow.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-16 w-16 rounded-full bg-card border-2 border-border flex items-center justify-center ${step.color}`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-center">{step.label}</p>
                  </div>
                  {index < architectureFlow.length - 1 && (
                    <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Data Ingestion Layer</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Real-time transaction stream processing</li>
                  <li>User behavior tracking</li>
                  <li>Device fingerprinting</li>
                  <li>Merchant profile data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Engineering</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Temporal features (hour, weekday)</li>
                  <li>Transaction velocity (24h window)</li>
                  <li>Behavioral flags (new payee, device change)</li>
                  <li>Amount normalization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supervised Models</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Random Forest Classifier (primary)</li>
                  <li>XGBoost (ensemble backup)</li>
                  <li>Class-balanced training</li>
                  <li>Probability-based scoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Isolation Forest algorithm</li>
                  <li>Detects novel fraud patterns</li>
                  <li>Unsupervised learning approach</li>
                  <li>3% contamination threshold</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Innovation Comparison */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Existing Systems vs Proposed System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="py-3 px-4">Aspect</th>
                      <th className="py-3 px-4">Existing Systems</th>
                      <th className="py-3 px-4 text-primary">Our Innovation</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/40">
                      <td className="py-3 px-4 font-medium text-foreground">Detection Method</td>
                      <td className="py-3 px-4">Rule-based or single model</td>
                      <td className="py-3 px-4">Hybrid ML (supervised + unsupervised)</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-3 px-4 font-medium text-foreground">Explainability</td>
                      <td className="py-3 px-4">Black box decisions</td>
                      <td className="py-3 px-4">SHAP-based transparent insights</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-3 px-4 font-medium text-foreground">UPI Features</td>
                      <td className="py-3 px-4">Generic transaction data</td>
                      <td className="py-3 px-4">UPI-specific behavioral analytics</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-3 px-4 font-medium text-foreground">Novel Fraud</td>
                      <td className="py-3 px-4">Limited detection</td>
                      <td className="py-3 px-4">Anomaly detection catches new patterns</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Response Time</td>
                      <td className="py-3 px-4">Minutes to hours</td>
                      <td className="py-3 px-4">Real-time (&lt;50ms)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Technical Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Machine Learning</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Scikit-learn</li>
                    <li>• XGBoost</li>
                    <li>• SHAP</li>
                    <li>• Pandas/NumPy</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Backend</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• TypeScript</li>
                    <li>• Edge Functions</li>
                    <li>• RESTful API</li>
                    <li>• Real-time processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Frontend</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• React + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Recharts</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Architecture;
