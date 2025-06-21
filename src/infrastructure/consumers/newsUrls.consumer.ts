import { rabbitMQService } from '../rabbitmq.service';
import { NewsService } from '../../domain/news/news.service';
import { AbcNewsScrapperService } from '../../domain/scrapper/abcnews.scrapper.service';

const newsService = new NewsService();
const abcNewsScrapper = new AbcNewsScrapperService();

export async function startNewsUrlsConsumer() {
  await rabbitMQService.connect();
  const channel = (rabbitMQService as any).channel;
  const queue = 'news_urls';
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg: any) => {
    if (msg !== null) {
      const url = msg.content.toString();
      console.log('Received URL:', url);
      try {
        if (url.includes('abcnews.go.com')) {
          const newsData = await abcNewsScrapper.extractFromUrl(url);
          console.log('👀 News data:', newsData);

          if (!newsData || Object.keys(newsData).length === 0 || newsData.imageUrl === '' || !newsData.publisherUrl) {
            console.warn('🚮 No valid news data found, skipping news item:', url);
            channel.ack(msg); // Acknowledge the message even if no image found or invalid data
            return;
          }
          
          const result = await newsService.upsert(newsData);
          console.log('✅ News data saved:', result.id);
        } else {
          console.error('Unsupported news source:', url);
        }
        channel.ack(msg);
      } catch (err: any) {
        console.error('❌ Error processing URL:', url, err.message);
        channel.nack(msg, false, true); // Requeue the message for other errors
      } 
    }
  });
  console.log(`Consumer started for queue: ${queue}`);
}
