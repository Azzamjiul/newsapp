import { asyncHandler } from '../../utils/asyncHandler';
import { Request, Response } from 'express';
import { NewsService } from './news.service';

// List news with search and cursor pagination
export const listNews = asyncHandler(async (req: Request, res: Response) => {
  const { search = '', cursor, limit = 10 } = req.query;
  const result = await NewsService.list(String(search), cursor ? String(cursor) : undefined, Number(limit));
  res.json(result);
});

// Get single news by id
export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await NewsService.get(req.params.id);
  if (!news) return res.status(404).json({ error: 'News not found' });
  res.json(news);
});

// Update news by id
export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await NewsService.update(req.params.id, req.body);
  if (!news) return res.status(404).json({ error: 'News not found' });
  res.json(news);
});

// Delete news by id
export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await NewsService.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'News not found' });
  res.json({ message: 'News deleted' });
});
