const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Network API for Music Reviews - S.E [UFRN - DCA3603]',
      version: '0.0.1',
      description: 'Documentation of the Social Network API for Music Reviews, Based on the Letterboxd Model. Project developed by: **Ernane Ferreira Rocha Junior**, **Quelita Miriam Nunes Ferraz**, **Rosélia Nascimento da Silva**, **Vinícius Costa Bulhões** and **José Martins Neto**. This project was carried out as part of the assessment of the second unit of the discipline **DCA3603 - Software Engineering**, under the guidance of professor **Eduardo de Lucena Falcão**.',
    },
    security: [
      { bearerAuth: [], }, // JWT token authentication
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development Server', },
    ],
  },
  apis: ['./src/routes/AuthRoutes.js', './src/routes/CommentRoutes.js', './src/routes/LikeRoutes.js', './src/routes/ReviewRoutes.js', './src/routes/SongRoutes.js', './src/routes/UserRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;