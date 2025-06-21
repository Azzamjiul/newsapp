import { Router } from 'express';
import { listNews, getNews, updateNews, deleteNews } from './news.controller';
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
 *         title:
 *           type: string
 *           example: "Breaking News Title"
 *         content:
 *           type: string
 *           example: "This is the content of the news."
 *         author:
 *           type: string
 *           example: "John Doe"
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-21T12:00:00Z"
 *         source:
 *           type: string
 *           example: "BBC"
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
 *   put:
 *     summary: Update news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       200:
 *         description: News updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 *   delete:
 *     summary: Delete news by ID
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
 *         description: News deleted
 *       404:
 *         description: News not found
 */

router.get('/', listNews);
router.get('/:id', getNews);

export default router;
