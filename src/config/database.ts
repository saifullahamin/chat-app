import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in the .env file');
}

const sequelize = new Sequelize(databaseUrl, {
  logging: false,
});

export default sequelize;
