import "./WeatherStoredList.scss";
import { WeatherStoredProps } from "../../config/openmeteo-config";
import WeatherCard from "../weatherCard/WeatherCard";

const WeatherStoredList: React.FC<{
  weatherStoredData: WeatherStoredProps[];
}> = ({ weatherStoredData }) => {
  return (
    <div className="WeatherStoredList__container">
      <div className="WeatherStoredList--data__container">
        {weatherStoredData.map((weatherSingleStoredData) => (
          <WeatherCard
            key={weatherSingleStoredData.id}
            time={weatherSingleStoredData.time}
            temperature={weatherSingleStoredData.temperature_2m}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherStoredList;
