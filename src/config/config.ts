import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}

interface AppConfig {
  port: number;
  db: DatabaseConfig;
  jwtSecret: string;
}

export const config: AppConfig = {
  port: Number(process.env.PORT) || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'newsarc',
  },
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
};

export default config; 