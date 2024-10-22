import "./WeatherForecastList.scss";
import { WeatherForecastProps } from "../../config/openmeteo-config";
import WeatherCard from "../weatherCard/WeatherCard";

const WeatherForecastList: React.FC<{
  weatherForecastData: WeatherForecastProps;
}> = ({ weatherForecastData }) => {
  return (
    <div className="WeatherForecastList__container">
      <div className="WeatherForecastList--data__container">
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

export default WeatherForecastList;
