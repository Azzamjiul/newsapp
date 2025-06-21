import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt } from 'sequelize-typescript';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         notificationsEnabled:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  notificationsEnabled?: boolean;
}

@Table({ tableName: 'users' })
export class User extends Model<IUser> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  notificationsEnabled!: boolean;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;
}