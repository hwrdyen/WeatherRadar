import axios from "axios";
import { Request, Response } from "express";

export const fetchWeather = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: 52.52, // dynamic based on user location (req.query.latitude)
        longitude: 13.41, // (req.query.longitude)
        hourly: "temperature_2m",
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch weather data" });
  }
};
