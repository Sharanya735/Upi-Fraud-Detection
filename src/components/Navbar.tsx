import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              UPI Fraud Detection
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/architecture" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Architecture
            </Link>
            <Link to="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Live Demo
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/research" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Research
            </Link>
          </div>

          <Button asChild size="sm">
            <Link to="/demo">Try Demo</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
