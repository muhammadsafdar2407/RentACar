import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "RentACar",
  password: "abc123xyz",
  port: 5432,
});

// const devConfig = process.env.DEPLOY_DB_SETTINGS;

// const pool = new Pool({
//   connectionString: devConfig,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

export default pool;
