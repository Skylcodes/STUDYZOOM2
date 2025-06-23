/**
 * API documentation route for StudyZoom
 * Provides OpenAPI specification for the StudyZoom API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AppInfo } from '@/constants/app-info';
import { withRequestLogging } from '@/middleware/logging-middleware';
import { withResponseSecurityHeaders } from '@/middleware/security-headers';

// OpenAPI specification for StudyZoom API
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'StudyZoom API',
    description: 'API for the StudyZoom platform - an AI-powered academic support platform',
    version: AppInfo.VERSION,
    contact: {
      name: 'StudyZoom Support',
      url: 'https://studyzoom.app/support',
      email: 'support@studyzoom.app'
    },
    license: {
      name: 'Proprietary',
      url: 'https://studyzoom.app/terms'
    }
  },
  servers: [
    {
      url: 'https://api.studyzoom.app/v1',
      description: 'Production API server'
    },
    {
      url: 'https://staging-api.studyzoom.app/v1',
      description: 'Staging API server'
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Local development server'
    }
  ],
  tags: [
    {
      name: 'auth',
      description: 'Authentication and authorization endpoints'
    },
    {
      name: 'user',
      description: 'User management endpoints'
    },
    {
      name: 'study-sets',
      description: 'Study set management endpoints'
    },
    {
      name: 'flashcards',
      description: 'Flashcard management endpoints'
    },
    {
      name: 'quizzes',
      description: 'Quiz management endpoints'
    },
    {
      name: 'study-materials',
      description: 'Study material management endpoints'
    },
    {
      name: 'contacts',
      description: 'Contact management endpoints'
    },
    {
      name: 'health',
      description: 'Health check endpoints'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        description: 'Check the health status of the API',
        tags: ['health'],
        parameters: [
          {
            name: 'detailed',
            in: 'query',
            description: 'Include detailed performance metrics',
            required: false,
            schema: {
              type: 'boolean'
            }
          }
        ],
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['healthy'],
                      description: 'Health status'
                    },
                    version: {
                      type: 'string',
                      description: 'API version'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Current timestamp'
                    }
                  }
                }
              }
            }
          },
          '503': {
            description: 'API is unhealthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['unhealthy'],
                      description: 'Health status'
                    },
                    error: {
                      type: 'string',
                      description: 'Error message'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/study-materials/{materialId}': {
      get: {
        summary: 'Get study material',
        description: 'Retrieve a study material file by ID',
        tags: ['study-materials'],
        parameters: [
          {
            name: 'materialId',
            in: 'path',
            description: 'Study material ID',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          },
          {
            name: 'v',
            in: 'query',
            description: 'File version hash for cache busting',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'download',
            in: 'query',
            description: 'Force download instead of inline display',
            required: false,
            schema: {
              type: 'boolean'
            }
          }
        ],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Study material file',
            content: {
              'application/octet-stream': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          '404': {
            description: 'Study material not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from authentication'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Error type'
              },
              code: {
                type: 'string',
                description: 'Error code'
              },
              message: {
                type: 'string',
                description: 'Error message'
              },
              details: {
                type: 'object',
                description: 'Additional error details'
              }
            }
          }
        }
      }
    }
  }
};

/**
 * GET handler for API documentation
 * @param request Next.js request object
 * @returns Next.js response with OpenAPI specification
 */
async function GET(request: NextRequest): Promise<NextResponse> {
  // Check if format=yaml is requested
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  
  if (format === 'yaml') {
    // In a real implementation, we would convert to YAML here
    // For now, just return JSON with a message
    return NextResponse.json({
      message: 'YAML format not yet supported. Please use JSON format.',
      ...openApiSpec
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  // Return JSON format by default
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// Apply middleware to the handler
export const { GET: enhancedGet } = {
  GET: withResponseSecurityHeaders(withRequestLogging(GET))
};

// Export the enhanced handler
export { enhancedGet as GET };
