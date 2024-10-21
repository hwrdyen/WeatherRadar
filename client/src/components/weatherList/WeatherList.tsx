import "./WeatherList.scss";
import { WeatherHourlyData } from "../../config/openmeteo-config";
import WeatherCard from "../weatherCard/WeatherCard";

const WeatherList: React.FC<{ weatherAllData: WeatherHourlyData }> = ({
  weatherAllData,
}) => {
  return (
    <div className="WeatherList__container">
      {weatherAllData.hourly.time.map((time, index) => (
        <WeatherCard
          key={time}
          time={time}
          temperature={weatherAllData.hourly.temperature_2m[index]}
        />
      ))}
    </div>
  );
};

export default WeatherList;
