import { Router } from 'express';
import { listNews, getNews, updateNews, deleteNews } from './news.controller';

const router = Router();

// List news with search and cursor pagination
router.get('/', listNews);
// Get single news by id
router.get('/:id', getNews);
// Update news by id
router.put('/:id', updateNews);
// Delete news by id
router.delete('/:id', deleteNews);

export default router;
