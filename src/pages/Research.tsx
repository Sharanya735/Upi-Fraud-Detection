import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Target, AlertCircle } from "lucide-react";

const Research = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Research <span className="text-primary">Outcomes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Performance metrics, benefits, and future directions of our hybrid ML fraud detection system
            </p>
          </div>

          {/* Model Performance */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Model Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">98.5%</div>
                  <p className="text-sm text-muted-foreground">
                    Overall classification accuracy on test set with balanced class distribution
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Recall
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">96.8%</div>
                  <p className="text-sm text-muted-foreground">
                    Successfully detected 96.8% of actual fraudulent transactions (minimizes false negatives)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    ROC-AUC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">0.97</div>
                  <p className="text-sm text-muted-foreground">
                    Excellent discrimination capability between fraudulent and legitimate transactions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Metrics */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Detailed Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Classification Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precision (Fraud Class):</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">F1-Score:</span>
                      <span className="font-medium">95.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">False Positive Rate:</span>
                      <span className="font-medium">1.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">False Negative Rate:</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Operational Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Inference Time:</span>
                      <span className="font-medium">43ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model Size (RF + ISO):</span>
                      <span className="font-medium">~12MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training Time:</span>
                      <span className="font-medium">~8 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SHAP Computation:</span>
                      <span className="font-medium">~15ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits of Hybrid Approach */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Hybrid ML Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Enhanced Detection Capability</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Combining supervised learning with anomaly detection provides coverage for both known fraud patterns 
                  and novel/emerging fraud techniques not seen during training.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reduced False Positives</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Weighted fusion of supervised probability and anomaly score creates more nuanced risk assessment, 
                  reducing unnecessary transaction blocks and improving customer experience.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Explainable Decisions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  SHAP values provide transparent explanations for each prediction, enabling analysts to understand 
                  model decisions and comply with regulatory requirements for AI transparency.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UPI-Specific Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Purpose-built features capture UPI payment behavior patterns including device changes, payee relationships, 
                  and transaction velocity specific to India's payment ecosystem.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-Time Processing</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Optimized inference pipeline enables sub-50ms response times, allowing real-time fraud prevention 
                  without impacting user experience during checkout.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adaptive Learning</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Model can be retrained on new fraud patterns while isolation forest continuously adapts to 
                  evolving transaction behaviors, maintaining effectiveness over time.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Expected Outcomes */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Expected Deployment Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Fraud Loss Reduction</h3>
                    <p className="text-sm text-muted-foreground">
                      Expected 60-70% reduction in fraud-related financial losses through early detection 
                      and prevention of high-risk transactions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Operational Efficiency</h3>
                    <p className="text-sm text-muted-foreground">
                      Automated risk scoring reduces manual review workload by ~50%, allowing analysts 
                      to focus on complex cases requiring human judgment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Customer Trust</h3>
                    <p className="text-sm text-muted-foreground">
                      Transparent explanations and reduced false positives improve customer trust 
                      in the payment platform and reduce support ticket volume.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Regulatory Compliance</h3>
                    <p className="text-sm text-muted-foreground">
                      SHAP-based explainability ensures compliance with emerging AI regulations 
                      and financial sector audit requirements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Scalability</h3>
                    <p className="text-sm text-muted-foreground">
                      Lightweight models and fast inference enable horizontal scaling to handle 
                      millions of daily transactions without infrastructure burden.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations & Future Work */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Limitations & Future Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-destructive">Current Limitations</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Model requires periodic retraining to adapt to new fraud patterns</li>
                    <li>Windowed features (24h velocity) may have cold-start issues for new users</li>
                    <li>SHAP computation adds ~15ms latency for explainability</li>
                    <li>Limited to structured transaction data; doesn't analyze free-text descriptions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-primary">Future Enhancements</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Deep learning models (LSTM/Transformer) for sequential transaction patterns</li>
                    <li>Graph neural networks to model user-merchant-device relationship networks</li>
                    <li>Natural language processing for analyzing transaction descriptions</li>
                    <li>Federated learning for privacy-preserving model updates across institutions</li>
                    <li>Real-time model retraining pipeline with automated MLOps</li>
                    <li>Integration with external fraud intelligence databases</li>
                    <li>Multi-modal analysis incorporating biometric and behavioral data</li>
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

export default Research;
