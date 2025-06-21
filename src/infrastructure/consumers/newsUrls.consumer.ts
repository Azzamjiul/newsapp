import { rabbitMQService } from '../rabbitmq.service';

export async function startNewsUrlsConsumer() {
  await rabbitMQService.connect();
  const channel = (rabbitMQService as any).channel;
  const queue = 'news_urls';
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (msg: any) => {
    if (msg !== null) {
      const url = msg.content.toString();
      console.log('Received URL:', url);
      // TODO: Call domain/application service to process the URL
      channel.ack(msg);
    }
  });
  console.log(`Consumer started for queue: ${queue}`);
}
