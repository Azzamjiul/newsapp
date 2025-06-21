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
          if(newsData.imageUrl == '') {
            console.warn('No image found, skipping news item:', url);
            channel.ack(msg); // Acknowledge the message even if no image found
            return;
          }
          
          const result = await newsService.upsert(newsData);
          console.log('✅ News data saved:', result.id);
        } else {
          console.error('Unsupported news source:', url);
        }
        channel.ack(msg);
      } catch (err) {
        console.error('Error processing URL:', url, err);
        channel.nack(msg, false, true); // Requeue the message
      } 
    }
  });
  console.log(`Consumer started for queue: ${queue}`);
}
