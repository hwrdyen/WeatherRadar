import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { Pool } from "pg";

import openmeteoRoute from "../routes/openmeteo.route";
import authRoute from "../routes/auth.route";
import userRoute from "../routes/user.route";

const PORT = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true,
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
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api/openmeteo", openmeteoRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
