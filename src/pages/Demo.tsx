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
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  user_id: z.string().min(1, "User ID is required"),
  merchant_id: z.string().min(1, "Merchant ID is required"),
  device_id: z.string().min(1, "Device ID is required"),
  hour: z.string().min(1, "Hour is required"),
  weekday: z.string().min(1, "Weekday is required"),
  is_new_payee: z.string().min(1, "Required"),
  device_changed: z.string().min(1, "Required"),
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
      amount: "5000",
      user_id: "USER001",
      merchant_id: "MERCHANT001",
      device_id: "DEVICE001",
      hour: "14",
      weekday: "2",
      is_new_payee: "0",
      device_changed: "0",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("predict-fraud", {
        body: {
          amount: parseFloat(values.amount),
          user_id: values.user_id,
          merchant_id: values.merchant_id,
          device_id: values.device_id,
          hour: parseInt(values.hour),
          weekday: parseInt(values.weekday),
          is_new_payee: parseInt(values.is_new_payee),
          device_changed: parseInt(values.device_changed),
          tx_count_24h: 0,
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
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>Enter transaction information to analyze fraud risk</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5000" {...field} />
                          </FormControl>
                          <FormDescription>Amount in Indian Rupees</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="user_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User ID</FormLabel>
                            <FormControl>
                              <Input placeholder="USER001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="merchant_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Merchant ID</FormLabel>
                            <FormControl>
                              <Input placeholder="MERCHANT001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="device_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device ID</FormLabel>
                          <FormControl>
                            <Input placeholder="DEVICE001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hour (0-23)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="23" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weekday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weekday</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">Monday</SelectItem>
                                <SelectItem value="1">Tuesday</SelectItem>
                                <SelectItem value="2">Wednesday</SelectItem>
                                <SelectItem value="3">Thursday</SelectItem>
                                <SelectItem value="4">Friday</SelectItem>
                                <SelectItem value="5">Saturday</SelectItem>
                                <SelectItem value="6">Sunday</SelectItem>
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
                        name="is_new_payee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Payee?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="device_changed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Changed?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Transaction...
                        </>
                      ) : (
                        "Analyze Transaction"
                      )}
                    </Button>
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
