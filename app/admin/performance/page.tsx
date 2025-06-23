'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  AlertTriangle, 
  Clock, 
  Activity, 
  BarChart2, 
  RefreshCw 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePerformanceReport } from '@/lib/monitoring/performance-monitor';

// Mock data for the performance dashboard
// In a real implementation, this would be fetched from an API
const generateMockPerformanceData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() - (24 - i) * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTime: Math.floor(Math.random() * 100) + 50,
      errorRate: Math.random() * 2,
      requests: Math.floor(Math.random() * 100) + 20
    });
  }
  
  return data;
};

const routeData = [
  { name: '/api/documents', avgTime: 120, p95Time: 250, errorRate: 0.5, requests: 1250 },
  { name: '/api/auth', avgTime: 80, p95Time: 150, errorRate: 0.2, requests: 980 },
  { name: '/api/flashcards', avgTime: 150, p95Time: 320, errorRate: 1.2, requests: 750 },
  { name: '/api/quizzes', avgTime: 200, p95Time: 450, errorRate: 0.8, requests: 520 },
  { name: '/api/summary', avgTime: 350, p95Time: 780, errorRate: 1.5, requests: 320 },
];

/**
 * Performance monitoring dashboard for StudyZoom administrators
 * Displays real-time performance metrics and analytics
 */
export default function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState(generateMockPerformanceData());
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  
  // Refresh performance data
  const refreshData = () => {
    setLoading(true);
    
    // In a real implementation, this would fetch data from an API
    setTimeout(() => {
      // For now, we'll use the mock data generator
      setPerformanceData(generateMockPerformanceData());
      
      // In a real implementation, we would use the performance monitor
      const report = generatePerformanceReport();
      console.log('Performance Report:', report);
      
      setLoading(false);
    }, 500);
  };
  
  useEffect(() => {
    refreshData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(refreshData, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and analyze StudyZoom application performance
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124ms</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8%</div>
            <p className="text-xs text-muted-foreground">
              -0.3% from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests / Minute</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +12% from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P95 Response Time</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320ms</div>
            <p className="text-xs text-muted-foreground">
              +8.1% from last hour
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Time (Last 24 Hours)</CardTitle>
              <CardDescription>
                Average response time across all API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="responseTime" 
                    name="Response Time (ms)" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Error Rate (Last 24 Hours)</CardTitle>
                <CardDescription>
                  Percentage of requests resulting in errors
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="errorRate" 
                      name="Error Rate (%)" 
                      stroke="#ff0000" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Request Volume (Last 24 Hours)</CardTitle>
                <CardDescription>
                  Number of requests per hour
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="requests" 
                      name="Requests" 
                      fill="#82ca9d" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Route</CardTitle>
              <CardDescription>
                Average response times and error rates by API route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 font-medium">
                      <th className="p-2 text-left">Route</th>
                      <th className="p-2 text-left">Avg Time</th>
                      <th className="p-2 text-left">P95 Time</th>
                      <th className="p-2 text-left">Error Rate</th>
                      <th className="p-2 text-left">Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routeData.map((route, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : ''}>
                        <td className="p-2">{route.name}</td>
                        <td className="p-2">{route.avgTime}ms</td>
                        <td className="p-2">{route.p95Time}ms</td>
                        <td className="p-2">{route.errorRate}%</td>
                        <td className="p-2">{route.requests}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>
                Most recent errors from the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 font-medium">
                      <th className="p-2 text-left">Time</th>
                      <th className="p-2 text-left">Route</th>
                      <th className="p-2 text-left">Error</th>
                      <th className="p-2 text-left">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">12:42:15</td>
                      <td className="p-2">/api/documents/generate</td>
                      <td className="p-2">500 Internal Server Error</td>
                      <td className="p-2">user_123456</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="p-2">12:38:22</td>
                      <td className="p-2">/api/quizzes/submit</td>
                      <td className="p-2">400 Bad Request</td>
                      <td className="p-2">user_789012</td>
                    </tr>
                    <tr>
                      <td className="p-2">12:35:07</td>
                      <td className="p-2">/api/auth/session</td>
                      <td className="p-2">401 Unauthorized</td>
                      <td className="p-2">anonymous</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Showing 3 of 24 errors in the last hour
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
