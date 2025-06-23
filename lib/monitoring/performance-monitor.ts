/**
 * Performance monitoring utilities for StudyZoom
 * These functions help track and analyze application performance
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

// Performance metrics storage
interface PerformanceMetric {
  route: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: number;
  userAgent?: string;
  userId?: string;
}

// In-memory storage for metrics (would be replaced with a proper monitoring service in production)
const metrics: PerformanceMetric[] = [];
const METRICS_LIMIT = 1000; // Limit the number of metrics stored in memory

/**
 * Start timing a server operation
 * @param name Name of the operation
 * @returns Timer object with start time
 */
export function startTimer(name: string) {
  const startTime = performance.now();
  return {
    name,
    startTime,
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      }
      
      return {
        name,
        startTime,
        endTime,
        duration
      };
    }
  };
}

/**
 * Middleware to track API route performance
 * @param request Next.js request object
 * @param handler Request handler function
 * @returns Next.js response
 */
export async function withPerformanceTracking(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = performance.now();
  const url = new URL(request.url);
  const route = url.pathname;
  const method = request.method;
  const userAgent = request.headers.get('user-agent') || undefined;
  
  try {
    // Execute the handler
    const response = await handler(request);
    
    // Record performance metrics
    const endTime = performance.now();
    const duration = endTime - startTime;
    const status = response.status;
    
    // Get user ID from request headers if available
    const userId = request.headers.get('x-user-id') || undefined;
    
    // Store metrics
    storeMetric({
      route,
      method,
      startTime,
      endTime,
      duration,
      status,
      userAgent,
      userId
    });
    
    // Add performance headers to response
    response.headers.set('Server-Timing', `total;dur=${duration}`);
    
    return response;
  } catch (error) {
    // Record error metrics
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    storeMetric({
      route,
      method,
      startTime,
      endTime,
      duration,
      status: 500,
      userAgent
    });
    
    throw error;
  }
}

/**
 * Store a performance metric
 * @param metric Performance metric to store
 */
function storeMetric(metric: PerformanceMetric) {
  metrics.push(metric);
  
  // Limit the number of metrics stored in memory
  if (metrics.length > METRICS_LIMIT) {
    metrics.shift();
  }
}

/**
 * Get performance metrics for analysis
 * @param route Optional route filter
 * @param timeRange Optional time range in milliseconds
 * @returns Filtered performance metrics
 */
export function getPerformanceMetrics(route?: string, timeRange?: number) {
  let filteredMetrics = metrics;
  
  if (route) {
    filteredMetrics = filteredMetrics.filter(m => m.route === route);
  }
  
  if (timeRange) {
    const now = performance.now();
    filteredMetrics = filteredMetrics.filter(m => now - m.endTime < timeRange);
  }
  
  return filteredMetrics;
}

/**
 * Calculate performance statistics for a set of metrics
 * @param metrics Performance metrics to analyze
 * @returns Performance statistics
 */
export function calculatePerformanceStats(metrics: PerformanceMetric[]) {
  if (metrics.length === 0) {
    return {
      count: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p95Duration: 0,
      errorRate: 0
    };
  }
  
  const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
  const errorCount = metrics.filter(m => m.status >= 400).length;
  
  const p95Index = Math.floor(durations.length * 0.95);
  
  return {
    count: metrics.length,
    avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    minDuration: durations[0],
    maxDuration: durations[durations.length - 1],
    p95Duration: durations[p95Index],
    errorRate: errorCount / metrics.length
  };
}

/**
 * Generate a performance report for the application
 * @returns Performance report object
 */
export function generatePerformanceReport() {
  const last5Min = getPerformanceMetrics(undefined, 5 * 60 * 1000);
  const last1Hour = getPerformanceMetrics(undefined, 60 * 60 * 1000);
  
  // Group metrics by route
  const routeMetrics: Record<string, PerformanceMetric[]> = {};
  
  last1Hour.forEach(metric => {
    if (!routeMetrics[metric.route]) {
      routeMetrics[metric.route] = [];
    }
    routeMetrics[metric.route].push(metric);
  });
  
  // Calculate stats for each route
  const routeStats: Record<string, ReturnType<typeof calculatePerformanceStats>> = {};
  
  Object.entries(routeMetrics).forEach(([route, metrics]) => {
    routeStats[route] = calculatePerformanceStats(metrics);
  });
  
  return {
    overall: {
      last5Min: calculatePerformanceStats(last5Min),
      last1Hour: calculatePerformanceStats(last1Hour)
    },
    routes: routeStats
  };
}
