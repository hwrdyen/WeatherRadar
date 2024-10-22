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

export interface WeatherStoredProps {
  id: string;
  userId: string;
  time: string;
  interval: number;
  temperature_2m: number;
  createdAt: Date;
}

export interface WeatherCardProps {
  time: string;
  temperature: number;
}
