import express from "express";
import {
  fetchHistoricalWeather,
  fetchWeather,
} from "../models/openmeteo.model";

const router = express.Router();

router.post("/weather", fetchWeather);
router.post("/historical-weather", fetchHistoricalWeather);

export default router;
