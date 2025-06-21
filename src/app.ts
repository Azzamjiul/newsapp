import express from 'express';
import cors from 'cors';
import userRouter from './domain/user/user.route';
import newsRouter from './domain/news/news.route';
import scrapperRouter from './domain/scrapper/scrapper.route';
import { config, sequelize } from './config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Newsarc API',
      version: '1.0.0',
      description: 'API documentation for Newsarc backend',
    },
    servers: [
      { url: 'http://localhost:4000' }
    ],
  },
  apis: ['./src/domain/user/*.ts', './src/domain/news/*.ts', './src/domain/scrapper/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/news', newsRouter);
app.use('/api/scrapper', scrapperRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log('DB Connection Info:', config.db);

sequelize.sync().then(() => {
  console.log('Database synced');
});

export default app;
