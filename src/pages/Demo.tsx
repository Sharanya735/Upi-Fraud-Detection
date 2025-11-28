import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveStats from "@/components/LiveStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, CheckCircle2, BarChart3, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  transaction_type: z.string().min(1, "Transaction type is required"),
  device_type: z.string().min(1, "Device type is required"),
  location: z.string().min(1, "Location is required"),
  time_of_day: z.string().min(1, "Time of day is required"),
  merchant_category: z.string().min(1, "Merchant category is required"),
  transaction_frequency: z.string().min(1, "Transaction frequency is required"),
  account_age: z.string().min(1, "Account age is required"),
  fraud_history: z.string().min(1, "Fraud history is required"),
});

interface PredictionResult {
  risk_score: number;
  is_fraud: number;
  supervised_prob: number;
  anomaly_flag: number;
  shap_top_features: Record<string, number>;
  latency_ms?: number;
}

const Demo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "5000",
      transaction_type: "p2p",
      device_type: "mobile",
      location: "Mumbai",
      time_of_day: "afternoon",
      merchant_category: "retail",
      transaction_frequency: "moderate",
      account_age: "6-12months",
      fraud_history: "none",
    },
  });

  const mapFormToAPI = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    
    const timeMap: Record<string, number> = {
      'early_morning': 4,
      'morning': 9,
      'afternoon': 14,
      'evening': 18,
      'night': 22,
      'late_night': 2,
    };
    
    const frequencyMap: Record<string, number> = {
      'first': 1,
      'rare': 3,
      'moderate': 8,
      'frequent': 15,
      'very_frequent': 25,
    };

    const is_new_payee = values.transaction_type === 'new_merchant' ? 1 : 0;
    const device_changed = values.device_type === 'new_device' ? 1 : 0;

    return {
      amount: parseFloat(values.amount),
      user_id: `USER_${Math.random().toString(36).substring(7).toUpperCase()}`,
      merchant_id: `MERCHANT_${values.merchant_category.toUpperCase()}`,
      device_id: `DEVICE_${values.device_type.toUpperCase()}`,
      hour: timeMap[values.time_of_day] || 14,
      weekday: now.getDay(),
      is_new_payee,
      device_changed,
      tx_count_24h: frequencyMap[values.transaction_frequency] || 5,
      timestamp: now.toISOString(),
    };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const apiParams = mapFormToAPI(values);
      
      const { data, error } = await supabase.functions.invoke("predict-fraud", {
        body: apiParams,
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: data.is_fraud === 1 ? "High Fraud Risk Detected!" : "Transaction Appears Safe",
        description: `Risk score: ${(data.risk_score * 100).toFixed(1)}%${data.latency_ms ? ` (${data.latency_ms.toFixed(0)}ms)` : ''}`,
        variant: data.is_fraud === 1 ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Unable to analyze transaction. Please check that your Python ML API is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Live <span className="text-primary">Fraud Detection</span> Demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Test our AI-powered fraud detection system with real-time predictions
            </p>
          </div>

          <LiveStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Transaction Parameters</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Legitimate
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-chart-2">
                      <AlertTriangle className="h-3 w-3" /> Suspicious
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-destructive">
                      <Activity className="h-3 w-3" /> High Risk
                    </Badge>
                  </div>
                </div>
                <CardDescription>Enter transaction details for fraud detection analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
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
                        name="transaction_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Type <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select transaction type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="p2p">Person to Person</SelectItem>
                                <SelectItem value="merchant">Merchant Payment</SelectItem>
                                <SelectItem value="bill">Bill Payment</SelectItem>
                                <SelectItem value="new_merchant">New Merchant</SelectItem>
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
                                <SelectTrigger>
                                  <SelectValue placeholder="Select device type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="tablet">Tablet</SelectItem>
                                <SelectItem value="desktop">Desktop</SelectItem>
                                <SelectItem value="new_device">New Device</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Location <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city or region" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="time_of_day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time of Day <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="early_morning">Early Morning (4-6 AM)</SelectItem>
                                <SelectItem value="morning">Morning (6-12 PM)</SelectItem>
                                <SelectItem value="afternoon">Afternoon (12-6 PM)</SelectItem>
                                <SelectItem value="evening">Evening (6-9 PM)</SelectItem>
                                <SelectItem value="night">Night (9 PM-12 AM)</SelectItem>
                                <SelectItem value="late_night">Late Night (12-4 AM)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="merchant_category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Merchant Category <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="food">Food & Dining</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                        name="transaction_frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Frequency <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="first">First Transaction</SelectItem>
                                <SelectItem value="rare">Rare (1-3/day)</SelectItem>
                                <SelectItem value="moderate">Moderate (4-10/day)</SelectItem>
                                <SelectItem value="frequent">Frequent (11-20/day)</SelectItem>
                                <SelectItem value="very_frequent">Very Frequent (20+/day)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="account_age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Age <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select account age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New (0-3 months)</SelectItem>
                                <SelectItem value="3-6months">Recent (3-6 months)</SelectItem>
                                <SelectItem value="6-12months">Established (6-12 months)</SelectItem>
                                <SelectItem value="1-2years">Mature (1-2 years)</SelectItem>
                                <SelectItem value="2years+">Veteran (2+ years)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="fraud_history"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Fraud History <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fraud history" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="low">Low (1-2 incidents)</SelectItem>
                              <SelectItem value="medium">Medium (3-5 incidents)</SelectItem>
                              <SelectItem value="high">High (5+ incidents)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => form.reset()}
                        className="flex-1"
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
                          <>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analyze Transaction
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

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
                            {result.latency_ms && ` • ${result.latency_ms.toFixed(0)}ms`}
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
                        Positive values increase fraud probability
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
                      Enter transaction details and analyze
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
