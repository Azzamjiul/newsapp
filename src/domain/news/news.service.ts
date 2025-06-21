import { Op } from 'sequelize';
import { News } from './news.model';

export const listNewsService = async (search: string, cursor: string | undefined, limit: number) => {
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
};

export const getNewsService = async (id: string) => {
  return News.findByPk(id);
};

export const updateNewsService = async (id: string, body: any) => {
  const news = await News.findByPk(id);
  if (!news) return null;
  await news.update(body);
  return news;
};

export const deleteNewsService = async (id: string) => {
  const news = await News.findByPk(id);
  if (!news) return null;
  await news.destroy();
  return true;
};
