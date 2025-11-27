import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, Shield, Activity } from "lucide-react";

const Dashboard = () => {
  // Sample data for visualizations
  const fraudTrendData = [
    { month: "Jan", fraudulent: 45, legitimate: 955 },
    { month: "Feb", fraudulent: 52, legitimate: 948 },
    { month: "Mar", fraudulent: 38, legitimate: 962 },
    { month: "Apr", fraudulent: 61, legitimate: 939 },
    { month: "May", fraudulent: 42, legitimate: 958 },
    { month: "Jun", fraudulent: 35, legitimate: 965 },
  ];

  const hourlyActivity = [
    { hour: "00:00", transactions: 23 },
    { hour: "04:00", transactions: 12 },
    { hour: "08:00", transactions: 145 },
    { hour: "12:00", transactions: 267 },
    { hour: "16:00", transactions: 198 },
    { hour: "20:00", transactions: 156 },
  ];

  const fraudTypes = [
    { name: "Account Takeover", value: 35, color: "#ef4444" },
    { name: "New Payee Fraud", value: 28, color: "#f97316" },
    { name: "Velocity Abuse", value: 22, color: "#eab308" },
    { name: "Device Fraud", value: 15, color: "#3b82f6" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Analytics <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time monitoring and insights into fraud detection performance
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-muted-foreground">+18% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">-5% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">43ms</div>
                <p className="text-xs text-muted-foreground">-8ms improvement</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Trends</CardTitle>
                <CardDescription>Monthly comparison of fraudulent vs legitimate transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fraudTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px"
                      }} 
                    />
                    <Bar dataKey="fraudulent" fill="hsl(var(--destructive))" name="Fraudulent" />
                    <Bar dataKey="legitimate" fill="hsl(var(--primary))" name="Legitimate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume by Hour</CardTitle>
                <CardDescription>Daily transaction pattern analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="hour" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="transactions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Type Distribution</CardTitle>
                <CardDescription>Breakdown of detected fraud patterns</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fraudTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fraudTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent High-Risk Alerts</CardTitle>
                <CardDescription>Last 5 flagged transactions requiring review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "TXN-9876", amount: "₹45,000", risk: 92, time: "2 min ago" },
                    { id: "TXN-9845", amount: "₹32,500", risk: 88, time: "15 min ago" },
                    { id: "TXN-9823", amount: "₹28,900", risk: 85, time: "32 min ago" },
                    { id: "TXN-9801", amount: "₹51,200", risk: 94, time: "1 hour ago" },
                    { id: "TXN-9789", amount: "₹19,800", risk: 81, time: "2 hours ago" },
                  ].map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div>
                          <p className="font-medium text-sm">{alert.id}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{alert.amount}</p>
                        <p className="text-xs text-destructive">{alert.risk}% risk</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
