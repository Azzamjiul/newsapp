import express from 'express';
import { scrapeNewsFromXml } from './scrapper.controller';

const router = express.Router();

// POST /api/scrapper
router.post('/', scrapeNewsFromXml);

export default router;
