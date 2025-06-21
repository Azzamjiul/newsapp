import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export class ScrapperService {
  async scrapeXml(xmlUrl: string) {
    const response = await fetch(xmlUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch XML from URL');
    }
    const xml = await response.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false, trim: true });

    if(parsed.rss?.$?.['xmlns:abcnews']) {
      return this.handleAbcNews(parsed);
    }

    return 'Unsupported XML format';
  }

  handleAbcNews(parsed: any) {
    const items = parsed?.rss?.channel?.item;
    if (!items) {
      throw new Error('No items found in XML');
    }

    // Ensure items is always an array
    const itemArray = Array.isArray(items) ? items : [items];
    const urls = itemArray
      .map((item: any) => item.link?._ || item.link)
      .filter((url: string | undefined) => !!url);
    return urls;
  }
}
