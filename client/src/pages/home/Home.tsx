import "./Home.scss";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import WeatherList from "../../components/weatherList/WeatherList";
import { WeatherHourlyData } from "../../config/openmeteo-config";

const Home = () => {
  const [weatherAllData, setWeatherAllData] = useState<WeatherHourlyData>({
    hourly: {
      time: [],
      temperature_2m: [],
    },
  });
  const [fetchingWeatherALlData, setFetchingWeatherALlData] = useState(true);
  const [isUpdating, setIsUpdating] = useState(true);

  const fetchWeatherAllData = async () => {
    try {
      const response = await apiRequest.get("/openmeteo/weather");
      setWeatherAllData(response.data);
    } catch (error) {
      console.error("Failed to fetch team data", error);
    } finally {
      setFetchingWeatherALlData(false);
    }
  };
  useEffect(() => {
    fetchWeatherAllData();

    let interval: NodeJS.Timeout; // Declare interval variable

    if (isUpdating) {
      // Set interval to fetch weather data every 60 seconds
      interval = setInterval(() => {
        fetchWeatherAllData();
      }, 60000); // 60,000 milliseconds = 60 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isUpdating]);

  const toggleUpdate = () => {
    setIsUpdating((prev) => !prev); // Toggle the updating state
  };

  console.log(weatherAllData);

  return (
    <div className="Home__container">
      <div className="WeatherForecast__container">
        <div className="WeatherForecast--title__container">
          <h1 className="WeatherList--title">Today's Forecast</h1>
          <div className="toggle-switch__container">
            <label className="toggle-switch__label">
              <input
                type="checkbox"
                className="toggle-switch__input"
                checked={isUpdating}
                onChange={toggleUpdate}
              />
              <span className="toggle-switch__slider"></span>
            </label>
            <span
              className={`toggle-switch__status toggle-switch--${
                isUpdating ? "play" : "pause"
              }`}
            >
              {isUpdating ? "Play" : "Paused"}
            </span>
          </div>
        </div>

        {!fetchingWeatherALlData ? (
          <h1>
            Date: {new Date(weatherAllData.hourly.time[0]).toLocaleDateString()}
          </h1>
        ) : (
          <p>Fetching Date...</p>
        )}

        {!fetchingWeatherALlData ? (
          <WeatherList weatherAllData={weatherAllData} />
        ) : (
          <p>Fetching Weather...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
