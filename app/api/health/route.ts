import { NextRequest, NextResponse } from 'next/server';

import { AppInfo } from '@/constants/app-info';
import { prisma } from '@/lib/db/prisma';
import { generatePerformanceReport } from '@/lib/monitoring/performance-monitor';

/**
 * Health check endpoint for StudyZoom
 * Returns system status information for monitoring
 */
export async function GET(request: NextRequest): Promise<Response> {
  const startTime = performance.now();
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Check database connection
    const dbStartTime = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbDuration = performance.now() - dbStartTime;
    
    // Get system information
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Get performance metrics if detailed flag is set
    let detailed = false;
    try {
      const { searchParams } = new URL(request.url);
      detailed = searchParams.get('detailed') === 'true';
    } catch (error) {
      // Ignore URL parsing errors
    }
    
    const performanceMetrics = detailed ? generatePerformanceReport() : null;
    
    // Calculate response time
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      version: AppInfo.VERSION,
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        responseTime: `${dbDuration.toFixed(2)}ms`
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
      },
      performance: performanceMetrics,
      responseTime: `${responseTime.toFixed(2)}ms`
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Server-Timing': `total;dur=${responseTime.toFixed(2)},db;dur=${dbDuration.toFixed(2)}`
      }
    });
  } catch (err) {
    console.error('Health check failed:', err);
    const { statusCode = 503 } = err as any;
    
    return NextResponse.json({
      status: 'unhealthy',
      version: AppInfo.VERSION,
      timestamp: new Date().toISOString(),
      error: (err as Error).message || 'Unknown error',
      userAgent
    }, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
