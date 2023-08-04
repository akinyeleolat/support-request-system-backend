// src/config.ts
export const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret';
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
export const PORT= process.env.PORT||3000


export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Customer Support Request System API',
        version: '1.0.0',
        description: 'API documentation for the Customer Support Request System',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['src/controllers/*.ts'], // Path to the Swagger-annotated files
  };
  

