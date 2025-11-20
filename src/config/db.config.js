require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  PORT = '5000'
} = process.env;

console.log("DB_PASSWORD from env:", DB_PASSWORD ? "Loaded" : "MISSING!");
console.log("DB_NAME:", DB_NAME);
console.log("DB_USER:", DB_USER);

if (!DB_NAME || !DB_USER) {
  console.error("Missing required DB credentials in .env file!");
  process.exit(1);
}

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || '', {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    // Fix for some Windows/Postgres issues
    ssl: false
  }
});

module.exports = sequelize;