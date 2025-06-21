import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

export interface INews {
  id?: number;
  imageUrl: string;
  title: string;
  description: string;
  content: string;
  publisherId: number;
  publisherUrl: string;
  createdAt: Date;
  importedAt: Date;
  createdAtUnix: number;
}

@Table({ tableName: 'news' })
export class News extends Model<INews> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ field: 'image_url', type: DataType.STRING, allowNull: false })
  imageUrl!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ field: 'publisher_id', type: DataType.INTEGER, allowNull: false })
  publisherId!: number;

  @Column({ field: 'publisher_url', type: DataType.STRING, allowNull: false })
  publisherUrl!: string;

  @Column({ field: 'imported_at', type: DataType.DATE, allowNull: false })
  importedAt!: Date;

  @Column({ field: 'created_at_unix', type: DataType.BIGINT, allowNull: false })
  createdAtUnix!: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @BeforeCreate
  static setCreatedAtUnix(instance: News) {
    instance.createdAtUnix = Math.floor((instance.createdAt ? instance.createdAt.getTime() : Date.now()) / 1000);
  }

  @BeforeUpdate
  static updateCreatedAtUnix(instance: News) {
    if (instance.changed('createdAt')) {
      instance.createdAtUnix = Math.floor(instance.createdAt.getTime() / 1000);
    }
  }
}