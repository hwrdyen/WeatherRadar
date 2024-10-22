import axios from "axios";
import { Request, Response } from "express";
import { now } from "moment";

export const fetchWeather = async (req: Request, res: Response) => {
  // set start
  const now = new Date();
  const startDate = new Date(now);
  const start = startDate.toISOString().split("T")[0];

  // set end
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 1);
  const end = endDate.toISOString().split("T")[0];

  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: 52.52, // dynamic based on user location (req.query.latitude)
        longitude: 13.41, // (req.query.longitude)
        current: "temperature_2m",
        hourly: "temperature_2m",
        start_date: start,
        end_date: end,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch weather data" });
  }
};

export const fetchHistoricalWeather = async (req: Request, res: Response) => {
  // set end
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(now.getDate() - 1);
  const end = endDate.toISOString().split("T")[0];
  // set start
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 6);
  const start = startDate.toISOString().split("T")[0];

  console.log("Start Date:", start);
  console.log("End Date:", end);

  try {
    const response = await axios.get(
      "https://archive-api.open-meteo.com/v1/archive",
      {
        params: {
          latitude: 52.52, // dynamic based on user location (req.query.latitude)
          longitude: 13.41, // (req.query.longitude)
          daily: ["temperature_2m_max", "temperature_2m_min"],
          timezone: "auto",
          start_date: start,
          end_date: end,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch historical weather data" });
  }
};
