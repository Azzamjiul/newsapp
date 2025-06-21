import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export interface IUserDeviceToken {
  id?: number;
  userId: number;
  deviceToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'user_device_tokens' })
export class UserDeviceToken extends Model<IUserDeviceToken> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.STRING, allowNull: false })
  deviceToken!: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt!: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDeviceToken:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         deviceToken:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
