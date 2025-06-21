import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ScrapperService } from './scrapper.service';

const scraperService = new ScrapperService();
export const scrapeNewsFromXml = asyncHandler(async (req: Request, res: Response) => {
  const { xmlUrl } = req.body;
  if (!xmlUrl) {
    return res.status(400).json({ error: 'xmlUrl is required' });
  }
  const result = await scraperService.scrapeXml(xmlUrl);
  res.json(result);
});
