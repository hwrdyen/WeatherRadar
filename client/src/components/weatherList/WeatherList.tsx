import "./WeatherList.scss";
import { WeatherForecastProps } from "../../config/openmeteo-config";
import WeatherCard from "../weatherCard/WeatherCard";

const WeatherList: React.FC<{ weatherForecastData: WeatherForecastProps }> = ({
  weatherForecastData,
}) => {
  return (
    <div className="WeatherList__container">
      <div className="WeatherList--data__container">
        {weatherForecastData.hourly.time.map((time, index) => (
          <WeatherCard
            key={time}
            time={time}
            temperature={weatherForecastData.hourly.temperature_2m[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherList;
