import { Router } from 'express';
import { listNews, getNews } from './news.controller';
import { validateBody } from '../../middleware/validateBody';
import { createNewsSchema, updateNewsSchema } from './news.zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         title:
 *           type: string
 *           example: "Breaking News Title"
 *         description:
 *           type: string
 *           example: "Short summary of the news."
 *         content:
 *           type: string
 *           example: "This is the content of the news."
 *         publisherId:
 *           type: integer
 *           example: 123
 *         publisherUrl:
 *           type: string
 *           example: "https://publisher.com/news/123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-21T12:00:00Z"
 *         importedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-21T12:05:00Z"
 */

const router = Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get list of news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *
 * /api/news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */

router.get('/', listNews);
router.get('/:id', getNews);

export default router;
