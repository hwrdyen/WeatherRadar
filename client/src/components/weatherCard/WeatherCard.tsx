import "./WeatherCard.scss";
import { WeatherCardProps } from "../../config/openmeteo-config";

const WeatherCard: React.FC<WeatherCardProps> = ({ time, temperature }) => {
  return (
    <div className="WeatherCard__container">
      <div className="WeatherCard--info__container">
        <p>
          {new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
        <p>{temperature} °C</p>
      </div>
    </div>
  );
};

export default WeatherCard;
