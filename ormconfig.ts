require("dotenv").config();

const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

export default {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": POSTGRES_USERNAME,
  "password": POSTGRES_PASSWORD,
  "database": "typegraphql-example",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entity/*.*"]
}
