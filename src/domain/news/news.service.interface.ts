import { NewsDTO, CreateNewsDTO, UpdateNewsDTO } from './news.dto';

export interface INewsService {
  list(search: string, cursor?: string, limit?: number): Promise<NewsDTO[]>;
  get(id: string): Promise<NewsDTO | null>;
  update(id: string, data: UpdateNewsDTO): Promise<NewsDTO | null>;
  delete(id: string): Promise<boolean>;
  create(data: CreateNewsDTO): Promise<NewsDTO>;
  upsert(newsData: Omit<NewsDTO, 'id'>): Promise<NewsDTO>;
}
