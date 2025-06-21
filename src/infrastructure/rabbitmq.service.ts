import amqp, { Channel, Options } from 'amqplib';
import { config } from '../config/config';

class RabbitMQService {
  private channel: Channel | null = null;
  private readonly url: string;

  constructor(url = config.rabbitmqUrl || 'amqp://localhost') {
    this.url = url;
  }

  async connect() {
    if (!this.channel) {
      const connection = await amqp.connect(this.url);
      this.channel = await connection.createChannel();
    }
  }

  async sendToQueue(queue: string, message: string, options?: Options.Publish) {
    if (!this.channel) {
      await this.connect();
    }
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true, ...options });
  }

  async close() {
    if (this.channel) await this.channel.close();
    this.channel = null;
  }
}

export const rabbitMQService = new RabbitMQService();
