import express from "express";
import cors from "cors";
import "dotenv/config";
import { Pool } from "pg";

const PORT = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    ca: process.env.TEMBO_CA, // CA certificate
  },
});
pool
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the process with a failure code
  });

const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
