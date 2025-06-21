import fetch from 'node-fetch';
import { INews } from '../news/news.model';

export interface AbcNewsJson {
  app: any;
  ads: any;
  analytics: any;
  routing: {
    location: {
      pathname: string;
      port: string;
      hash: string;
      path: string;
      host: string;
      protocol: string;
      params: string;
      query: Record<string, any>;
    };
    params: {
      section: string;
      slug: string;
      pageType: string;
      type: string;
      year: string;
    };
  };
  page: {
    key: string;
    title: string;
    type: string;
    meta: {
      title: string;
      description: string;
      keywords: string;
      canonical: string;
      social: any;
      robots: string;
      ampUrl: string;
      dateModified: string;
      enableDistroAPI: boolean;
    };
    content: {
      shell: any;
      story: {
        data: any;
        story: AbcNewsStory;
      };
      upw: any;
    };
    analytics: any;
    taboola: any;
  };
  request: any;
  viewport: any;
  user: any;
}

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
  alternativeHeadline?: string;
  articleSection?: string;
  metadata?: {
    timestamp?: string;
    dateModified?: string;
    sourceLine?: string;
    shortLink?: string;
    keywords?: string;
    title?: string;
    description?: string;
    canonicalUrl?: string;
    noIndexNoFollow?: boolean;
  };
  description?: string;
  shareData?: {
    networks?: string[];
    url?: string;
    title?: string;
    description?: string;
    shareButton?: string;
    analyticsData?: {
      storyId?: string;
      positionNumber?: string;
      mediaOnPage?: string;
      wordCount?: number;
      author?: string;
    };
  };
  parsedMedia?: any;
  leadMediaImage?: {
    caption?: {
      credit?: string;
      text?: string;
      lines?: number;
      showMoreAriaLabel?: string;
    };
    image?: {
      alt?: string;
      src?: string;
      sources?: any[];
    };
  };
  leadMediaGallery?: any;
  leadMediaVideo?: any;
  imageProps?: {
    caption?: {
      credit?: string;
      text?: string;
      lines?: number;
      showMoreAriaLabel?: string;
    };
    image?: {
      alt?: string;
      src?: string;
      sources?: any[];
    };
  };
  body?: string;
  publishedDate?: string;
  contributors?: Array<{
    name: string;
    url: string;
    role: string;
    logo: string;
    logoAlt: string;
    urlTarget: string;
  }>;
  authorsStr?: string;
  modifiedDate?: string;
  section?: string;
  wordCount?: number;
  relatedTags?: any;
  lead?: any;
  ads?: any;
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
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return {} as Omit<INews, 'id'>;
    }
    const html = await response.text();
    return this.extractFromHtml(html, url);
  }

  extractFromHtml(html: string, url: string): Omit<INews, 'id'> {
    const match = html.match(/window\['__abcnews__'\]\s*=\s*(\{[\s\S]*?\});/);
    if (match && match[1]) {
      try {
        const json: AbcNewsJson = JSON.parse(match[1]);
        // Use the correct nested path for the story object
        const story: AbcNewsStory | undefined = json.page?.content?.story?.story;
        if (story) {
          let thumbnail = '';

          // 1. Prefer leadMediaImage.image.src
          if (story.leadMediaImage?.image?.src) {
            thumbnail = story.leadMediaImage.image.src;
          }

          // 2. If not, check thumbnails array for the largest (if possible)
          if (!thumbnail && story.thumbnails && Array.isArray(story.thumbnails) && story.thumbnails.length > 0) {
            // If thumbnails have width info, pick the largest, else just pick the first
            // (ABC News thumbnails usually just have url, so fallback to first)
            thumbnail = story.thumbnails[0].url;
          }

          // 3. Fallback to image.url
          if (!thumbnail && story.image?.url) thumbnail = story.image.url;

          // 4. Fallback to heroImage.url
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
            createdAtUnix: story.metadata?.timestamp ? Math.floor(new Date(story.metadata.timestamp).getTime() / 1000) : Math.floor(Date.now() / 1000),
          };
        }
      } catch (e) {
        console.error('❌ Failed to parse __abcnews__ JSON:');
        throw new Error('❌ Failed to parse news JSON from HTML');
      }
    }
    return {} as Omit<INews, 'id'>;
  }
}
