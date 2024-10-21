import express from "express";
import { fetchWeather } from "../models/openmeteo.model";

const router = express.Router();

router.get("/weather", fetchWeather);

export default router;
