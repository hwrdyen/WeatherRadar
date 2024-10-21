import "./Home.scss";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import WeatherList from "../../components/weatherList/WeatherList";
import {
  WeatherTodayProps,
  WeatherForecastProps,
} from "../../config/openmeteo-config";

const Home = () => {
  const [weatherTodayData, setWeatherTodayData] = useState<WeatherTodayProps>({
    current: {
      time: "",
      interval: 0,
      temperature_2m: 0,
    },
  });
  const [weatherForecastData, setWeatherForecastData] =
    useState<WeatherForecastProps>({
      hourly: {
        time: [],
        temperature_2m: [],
      },
    });
  const [fetchingWeatherData, setFetchingWeatherData] = useState(true);
  const [isUpdating, setIsUpdating] = useState(true);

  const handleFetchCurrentWeather = async () => {
    try {
      const response = await apiRequest.get("/openmeteo/weather");
      setWeatherTodayData(response.data);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setFetchingWeatherData(false);
    }
  };

  // TODO: write StoreWeather API Endpoint
  const handleStoreCurrentWeather = async () => {
    try {
      const response = await apiRequest.get("/openmeteo/weather");
      setWeatherTodayData(response.data);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setFetchingWeatherData(false);
    }
  };

  const fetchWeatherAllData = async () => {
    try {
      const response = await apiRequest.get("/openmeteo/weather");
      setWeatherTodayData(response.data);
      setWeatherForecastData(response.data);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setFetchingWeatherData(false);
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

  console.log(weatherTodayData.current.time);

  return (
    <div className="Home__container">
      <div className="WeatherToday__container">
        <div className="WeatherToday--title__container">
          <h1 className="WeatherToday--title">Current Weather</h1>
          <button
            className="WeatherToday--button"
            onClick={handleFetchCurrentWeather}
          >
            Fetch Current Weather
          </button>

          <button
            className="WeatherToday--button"
            onClick={handleStoreCurrentWeather}
          >
            Store Current Weather
          </button>
        </div>
        {!fetchingWeatherData ? (
          <div>
            <div>
              Timestamp:{" "}
              {new Date(weatherTodayData.current.time).toLocaleDateString()}{" "}
              {new Date(weatherTodayData.current.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
            <div>Temperature: {weatherTodayData.current.temperature_2m} °C</div>
          </div>
        ) : (
          ""
        )}
      </div>

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

        {!fetchingWeatherData ? (
          <WeatherList weatherForecastData={weatherForecastData} />
        ) : (
          <p>Fetching Weather...</p>
        )}
      </div>

      <div className="WeatherHistorical__container">
        <div className="WeatherHistorical--title__container">
          <h1 className="WeatherHistorical--title">Historical Weather</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
