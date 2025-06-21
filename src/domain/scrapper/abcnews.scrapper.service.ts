import fetch from 'node-fetch';
import { INews } from '../news/news.model';

export interface AbcNewsStory {
  id: string;
  title: string;
  headline: string;
  url: string;
  provider: string;
  publisher: {
    name: string;
    logo: {
      url: string;
      height: number;
      width: number;
      '@type': string;
    };
  };
  alternativeHeadline: string;
  articleSection: string;
  metadata: {
    timestamp: string;
    dateModified: string;
    sourceLine: string;
    shortLink: string;
    keywords: string;
    title: string;
    description: string;
    canonicalUrl: string;
    noIndexNoFollow: boolean;
  };
  description: string;
  shareData: {
    networks: string[];
    url: string;
    title: string;
    description: string;
    shareButton: string;
    analyticsData: {
      storyId: string;
      positionNumber: string;
      mediaOnPage: string;
      wordCount: number;
      author: string;
    };
  };
  parsedMedia: any;
  leadMediaImage?: {
    caption: {
      credit: string;
      text: string;
      lines: number;
      showMoreAriaLabel: string;
    };
    image: {
      alt: string;
      src: string;
      sources: any[];
    };
  };
  leadMediaGallery?: any;
  leadMediaVideo?: any;
  imageProps?: {
    caption: {
      credit: string;
      text: string;
      lines: number;
      showMoreAriaLabel: string;
    };
    image: {
      alt: string;
      src: string;
      sources: any[];
    };
  };
  body: string;
  publishedDate: string;
  contributors: Array<{
    name: string;
    url: string;
    role: string;
    logo: string;
    logoAlt: string;
    urlTarget: string;
  }>;
  authorsStr: string;
  modifiedDate: string;
  section: string;
  wordCount: number;
  relatedTags: any;
  lead: any;
  ads: any;
  featuredVideo?: any;
  featuredImage?: any;
  dateline?: string;
  seo?: any;
  LivePromotion?: any;
  PersonalizedRecommend?: any;
  isShared?: boolean;
  media?: Array<{ type: string; url: string }>;
  thumbnails?: Array<{ url: string }>;
  image?: { url: string };
  heroImage?: { url: string };
}

export class AbcNewsScrapperService {
  async extractFromUrl(url: string): Promise<Omit<INews, 'id'>> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch news HTML');
    const html = await response.text();
    return this.extractFromHtml(html, url);
  }

  extractFromHtml(html: string, url: string): Omit<INews, 'id'> {
    const match = html.match(/window\['__abcnews__'\]\s*=\s*(\{[\s\S]*?\});/);
    if (match && match[1]) {
      try {
        const json = JSON.parse(match[1]);
        const story: AbcNewsStory = json?.page?.content?.story?.story;
        if (story) {
          let thumbnail = '';
          if (story.media && Array.isArray(story.media)) {
            const thumb = story.media.find((m: any) => m.type === 'image' && m.url);
            if (thumb) thumbnail = thumb.url;
          }
          if (!thumbnail && story.thumbnails && Array.isArray(story.thumbnails)) {
            thumbnail = story.thumbnails[0]?.url || '';
          }
          if (!thumbnail && story.image?.url) thumbnail = story.image.url;
          if (!thumbnail && story.heroImage?.url) thumbnail = story.heroImage.url;

          return {
            imageUrl: thumbnail || '',
            title: story.headline || story.title || '',
            description: story.description || '',
            content: story.body || '',
            publisherId: 1, // Set as needed
            publisherUrl: url,
            importedAt: new Date(),
            createdAt: story.metadata?.timestamp ? new Date(story.metadata.timestamp) : new Date(),
          };
        }
      } catch (e) {
        console.error('Failed to parse __abcnews__ JSON:', e);
      }
    }
    throw new Error('Failed to extract news from HTML');
  }
}
