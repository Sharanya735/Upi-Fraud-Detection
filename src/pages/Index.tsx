import { Link } from "react-router-dom";
import { ArrowRight, Download, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Real-Time AI-Powered Protection
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-fade-in">
              Real-Time UPI Fraud Detection
              <br />
              <span className="text-primary">Powered by AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in">
              Advanced hybrid machine learning system combining Random Forest, XGBoost, and Isolation Forest 
              to detect fraudulent UPI transactions with explainable AI insights using SHAP values.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button asChild size="lg" className="text-base">
                <Link to="/demo">
                  Try Live Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/architecture">
                  <Network className="mr-2 h-5 w-5" />
                  View System Architecture
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 px-4 bg-card border-y border-border/40">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98.5%</div>
                <div className="text-muted-foreground">Detection Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">&lt;50ms</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">0.97</div>
                <div className="text-muted-foreground">ROC-AUC Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Why UPI Fraud Detection Matters
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              With the exponential growth of digital payments in India, UPI fraud has become a critical concern. 
              Our AI-driven system provides real-time protection against sophisticated fraud patterns.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border/40 bg-card">
                <h3 className="text-xl font-semibold mb-3">The Problem</h3>
                <p className="text-muted-foreground">
                  Traditional rule-based systems struggle to detect evolving fraud patterns. 
                  Billions of dollars are lost annually to UPI fraud across millions of transactions.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border/40 bg-card">
                <h3 className="text-xl font-semibold mb-3">Our Solution</h3>
                <p className="text-muted-foreground">
                  Hybrid ML approach combining supervised learning with anomaly detection, 
                  featuring behavioral analytics and explainable AI for transparent decision-making.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
