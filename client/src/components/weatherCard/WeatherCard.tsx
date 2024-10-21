import { WeatherCardProps } from "../../config/openmeteo-config";

const WeatherCard: React.FC<WeatherCardProps> = ({ time, temperature }) => {
  return (
    <div>
      <h3>Date: {new Date(time).toLocaleString()}</h3>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};

export default WeatherCard;
