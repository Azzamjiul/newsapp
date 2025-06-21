import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ScrapperService } from './scrapper.service';

const scraperService = new ScrapperService();
export const scrapeNewsFromXml = asyncHandler(async (req: Request, res: Response) => {
  const { xmlUrls } = req.body;
  if (!Array.isArray(xmlUrls) || xmlUrls.length === 0) {
    return res.status(400).json({ error: 'xmlUrls (array) is required' });
  }
  const results = await Promise.all(xmlUrls.map((url: string) => scraperService.scrapeXml(url)));
  res.json(results);
});
