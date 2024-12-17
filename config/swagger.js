const swaggerJsdoc = require('swagger-jsdoc');

require('dotenv').config();

// Swagger 설정
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LOL Search API',
      version: '1.0.0',
      description: 'API Documentation',
    },
    servers: [
      {
        url: process.env.URL,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;