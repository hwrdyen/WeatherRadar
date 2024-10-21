export interface WeatherHourlyData {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export interface WeatherCardProps {
  time: string;
  temperature: number;
}
