import { Op, Optional } from 'sequelize';
import { News, INews } from './news.model';
import { INewsService } from './news.service.interface';
import { NewsDTO, CreateNewsDTO, UpdateNewsDTO } from './news.dto';

export class NewsService implements INewsService {
  async list(search: string, cursor: string | undefined, limit: number): Promise<NewsDTO[]> {
    const where: any = {};
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    if (cursor) {
      where.createdAtUnix = { [Op.lt]: Number(cursor) };
    }
    const news = await News.findAll({
      where,
      order: [['createdAtUnix', 'DESC']],
      limit,
    });
    const nextCursor = news.length > 0 ? news[news.length - 1].id : null;
    return news.map(n => n.toJSON() as NewsDTO);
  }

  async get(id: string): Promise<NewsDTO | null> {
    const news = await News.findByPk(id);
    return news ? (news.toJSON() as NewsDTO) : null;
  }

  async update(id: string, body: UpdateNewsDTO): Promise<NewsDTO | null> {
    const news = await News.findByPk(id);
    if (!news) return null;
    await news.update(body);
    return news.toJSON() as NewsDTO;
  }

  async delete(id: string): Promise<boolean> {
    const news = await News.findByPk(id);
    if (!news) return false;
    await news.destroy();
    return true;
  }

  async create(data: CreateNewsDTO): Promise<NewsDTO> {
    const news = await News.create(data as Optional<INews, "id">);
    return news.toJSON() as NewsDTO;
  }

  async upsert(newsData: Omit<INews, 'id'>) {
    const existing = await News.findOne({ where: { publisherUrl: newsData.publisherUrl } });
    if (existing) {
      await existing.update(newsData);
      return existing;
    } else {
      return News.create(newsData);
    }
  }
}
