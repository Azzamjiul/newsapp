// News DTO for API documentation and validation
export interface NewsDTO {
  id?: number;
  imageUrl: string;
  title: string;
  description: string;
  content: string;
  publisherId: number;
  publisherUrl: string;
  createdAt?: Date;
  createdAtUnix?: number;
  importedAt?: Date;
  author?: string;
  publishedAt?: Date;
  source?: string;
}

export interface CreateNewsDTO {
  imageUrl: string;
  title: string;
  description: string;
  content: string;
  publisherId: number;
  publisherUrl: string;
  importedAt: Date;
  createdAtUnix?: number;
  author?: string;
  publishedAt?: Date;
  source?: string;
}

export interface UpdateNewsDTO {
  imageUrl?: string;
  title?: string;
  description?: string;
  content?: string;
  publisherId?: number;
  publisherUrl?: string;
  importedAt?: Date;
  author?: string;
  publishedAt?: Date;
  source?: string;
}
