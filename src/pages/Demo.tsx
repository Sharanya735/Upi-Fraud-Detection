import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  trans_amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  category: z.string().min(1, "Merchant category is required"),
  device_type: z.string().min(1, "Device type is required"),
  state: z.string().min(1, "Transaction location is required"),
  trans_hour: z.string().min(1, "Time of day is required"),
  transaction_frequency: z.string().min(1, "Transaction frequency is required"),
  age: z.string().min(1, "Account age is required"),
  previous_fraud: z.string().min(1, "Previous fraud history is required"),
});

interface PredictionResult {
  risk_score: number;
  is_fraud: number;
  supervised_prob: number;
  anomaly_flag: number;
  shap_top_features: Record<string, number>;
}

const Demo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trans_amount: "5000",
      category: "0",
      device_type: "mobile",
      state: "22",
      trans_hour: "14",
      transaction_frequency: "normal",
      age: "25",
      previous_fraud: "no",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("predict-fraud", {
        body: {
          trans_amount: parseFloat(values.trans_amount),
          category: parseInt(values.category),
          device_type: values.device_type,
          state: parseInt(values.state),
          trans_hour: parseInt(values.trans_hour),
          transaction_frequency: values.transaction_frequency,
          age: parseInt(values.age),
          previous_fraud: values.previous_fraud,
        },
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: data.is_fraud === 1 ? "High Fraud Risk Detected!" : "Transaction Appears Safe",
        description: `Risk score: ${(data.risk_score * 100).toFixed(1)}%`,
        variant: data.is_fraud === 1 ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Unable to analyze transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    form.reset();
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Live <span className="text-primary">Fraud Detection</span> Demo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test our AI-powered fraud detection system with real-time predictions and explainable insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Parameters</CardTitle>
                <CardDescription>Enter transaction details for fraud detection analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="trans_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Amount (₹) <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter amount" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Merchant Category <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="0">Food & Dining</SelectItem>
                                <SelectItem value="1">Shopping</SelectItem>
                                <SelectItem value="2">Travel</SelectItem>
                                <SelectItem value="3">Entertainment</SelectItem>
                                <SelectItem value="4">Bills & Utilities</SelectItem>
                                <SelectItem value="5">Healthcare</SelectItem>
                                <SelectItem value="6">Education</SelectItem>
                                <SelectItem value="7">Personal Care</SelectItem>
                                <SelectItem value="8">Investments</SelectItem>
                                <SelectItem value="9">Insurance</SelectItem>
                                <SelectItem value="10">Electronics</SelectItem>
                                <SelectItem value="11">Groceries</SelectItem>
                                <SelectItem value="12">Fuel & Transport</SelectItem>
                                <SelectItem value="13">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="device_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Type <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select device type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="tablet">Tablet</SelectItem>
                                <SelectItem value="desktop">Desktop</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Location <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background max-h-[200px]">
                                <SelectItem value="22">Maharashtra</SelectItem>
                                <SelectItem value="14">Karnataka</SelectItem>
                                <SelectItem value="4">Tamil Nadu</SelectItem>
                                <SelectItem value="40">Gujarat</SelectItem>
                                <SelectItem value="38">Delhi</SelectItem>
                                <SelectItem value="15">West Bengal</SelectItem>
                                <SelectItem value="18">Rajasthan</SelectItem>
                                <SelectItem value="35">Telangana</SelectItem>
                                <SelectItem value="49">Uttar Pradesh</SelectItem>
                                <SelectItem value="17">Madhya Pradesh</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="trans_hour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time of Day <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select time period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="6">Morning (6-9 AM)</SelectItem>
                                <SelectItem value="12">Afternoon (12-3 PM)</SelectItem>
                                <SelectItem value="14">Afternoon (2-5 PM)</SelectItem>
                                <SelectItem value="18">Evening (6-9 PM)</SelectItem>
                                <SelectItem value="21">Night (9-12 PM)</SelectItem>
                                <SelectItem value="2">Late Night (12-6 AM)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="transaction_frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Frequency <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="low">Low (1-5 per day)</SelectItem>
                                <SelectItem value="normal">Normal (6-15 per day)</SelectItem>
                                <SelectItem value="high">High (16-30 per day)</SelectItem>
                                <SelectItem value="very_high">Very High (30+ per day)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Age <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select account age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="1">Less than 1 year</SelectItem>
                                <SelectItem value="2">1-2 years</SelectItem>
                                <SelectItem value="3">2-3 years</SelectItem>
                                <SelectItem value="5">3-5 years</SelectItem>
                                <SelectItem value="10">5-10 years</SelectItem>
                                <SelectItem value="20">More than 10 years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="previous_fraud"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Fraud History <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select fraud history" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                <SelectItem value="no">No Previous Fraud</SelectItem>
                                <SelectItem value="low">1-2 Incidents</SelectItem>
                                <SelectItem value="medium">3-5 Incidents</SelectItem>
                                <SelectItem value="high">More than 5 Incidents</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={resetForm}
                      >
                        Reset Form
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Transaction"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <>
                  <Card className={result.is_fraud === 1 ? "border-destructive" : "border-green-500"}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {result.is_fraud === 1 ? (
                          <AlertTriangle className="h-8 w-8 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        )}
                        <div>
                          <CardTitle className={result.is_fraud === 1 ? "text-destructive" : "text-green-500"}>
                            {result.is_fraud === 1 ? "High Fraud Risk" : "Safe Transaction"}
                          </CardTitle>
                          <CardDescription>
                            Overall Risk Score: {(result.risk_score * 100).toFixed(1)}%
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Risk Level</span>
                          <span className="font-medium">{(result.risk_score * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={result.risk_score * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Supervised Model</p>
                          <p className="text-lg font-semibold">{(result.supervised_prob * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Anomaly Score</p>
                          <p className="text-lg font-semibold">{result.anomaly_flag === 1 ? "Detected" : "Normal"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        <CardTitle>SHAP Feature Importance</CardTitle>
                      </div>
                      <CardDescription>Top contributing features to the prediction</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(result.shap_top_features).map(([feature, value]) => (
                          <div key={feature}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium capitalize">{feature.replace(/_/g, " ")}</span>
                              <span className={value > 0 ? "text-destructive" : "text-green-500"}>
                                {value > 0 ? "+" : ""}{value.toFixed(4)}
                              </span>
                            </div>
                            <Progress 
                              value={Math.abs(value) * 100} 
                              className="h-1"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Positive values increase fraud probability, negative values decrease it
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                    <p className="text-muted-foreground">
                      Enter transaction details and click "Analyze Transaction" to see fraud detection results
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
