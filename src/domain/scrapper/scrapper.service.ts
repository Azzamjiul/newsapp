import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export const scrapeXmlService = async (xmlUrl: string) => {
  const response = await fetch(xmlUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch XML from URL');
  }
  const xml = await response.text();
  const parsed = await parseStringPromise(xml, { explicitArray: false, trim: true });
  return parsed;
};
