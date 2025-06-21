import { Sequelize } from 'sequelize-typescript';
import { config } from './index';
import { User } from '../domain/user/user.model';
import { News } from '../domain/news/news.model';
import { UserDeviceToken } from '../domain/user/userDeviceToken.model';

const sequelize = new Sequelize({
  database: config.db.name,
  dialect: 'postgres',
  username: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  models: [User, News, UserDeviceToken],
  logging: false,
});

export default sequelize;