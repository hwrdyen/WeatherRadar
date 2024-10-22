import express from "express";
import {
  fetchHistoricalWeather,
  fetchWeather,
} from "../models/openmeteo.model";

const router = express.Router();

router.get("/weather", fetchWeather);
router.get("/historical-weather", fetchHistoricalWeather);

export default router;
