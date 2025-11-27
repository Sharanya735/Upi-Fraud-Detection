import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              © 2025 UPI Fraud Detection System. All rights reserved.
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Powered by Hybrid Machine Learning & AI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
