export interface WeatherTodayProps {
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
  };
}
export interface WeatherForecastProps {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export interface WeatherCardProps {
  time: string;
  temperature: number;
}
