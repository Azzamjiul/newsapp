import { Op } from 'sequelize';
import { News } from './news.model';

export class NewsService {
  async list(search: string, cursor: string | undefined, limit: number) {
    const where: any = {};
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    if (cursor) {
      where.id = { [Op.lt]: Number(cursor) };
    }
    const news = await News.findAll({
      where,
      order: [['id', 'DESC']],
      limit,
    });
    const nextCursor = news.length > 0 ? news[news.length - 1].id : null;
    return { data: news, nextCursor };
  }

  async get(id: string) {
    return News.findByPk(id);
  }

  async update(id: string, body: any) {
    const news = await News.findByPk(id);
    if (!news) return null;
    await news.update(body);
    return news;
  }

  async delete(id: string) {
    const news = await News.findByPk(id);
    if (!news) return null;
    await news.destroy();
    return true;
  }
}
