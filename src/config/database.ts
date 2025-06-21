import { Sequelize } from 'sequelize-typescript';
import { config } from './index';
import { User } from '../domain/user/user.model';

const sequelize = new Sequelize({
  database: config.db.name,
  dialect: 'postgres',
  username: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  models: [User],
  logging: false,
});

export default sequelize; 