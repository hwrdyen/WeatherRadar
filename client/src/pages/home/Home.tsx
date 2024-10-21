import "./Home.scss";
import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";
import WeatherList from "../../components/weatherList/WeatherList";
import {
  WeatherTodayProps,
  WeatherForecastProps,
} from "../../config/openmeteo-config";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;

  // Today's/Current Weather
  const [weatherCurrentData, setWeatherCurrentData] =
    useState<WeatherTodayProps>({
      current: {
        time: "",
        interval: 0,
        temperature_2m: 0,
      },
    });
  const [fetchingCurrentWeatherData, setFetchingCurrentWeatherData] =
    useState(true);
  const [isCurrentUpdating, setIsCurrentUpdating] = useState(true);
  const fetchCurrentWeatherData = async () => {
    try {
      const response = await apiRequest.get("/openmeteo/weather");
      setWeatherCurrentData(response.data);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setFetchingCurrentWeatherData(false);
    }
  };
  useEffect(() => {
    fetchCurrentWeatherData();

    let interval: NodeJS.Timeout; // Declare interval variable

    if (isCurrentUpdating) {
      // Set interval to fetch weather data every 60 seconds
      interval = setInterval(() => {
        fetchCurrentWeatherData();
      }, 60000); // 60,000 milliseconds = 60 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCurrentUpdating]);
  const toggleCurrentUpdate = () => {
    setIsCurrentUpdating((prev) => !prev); // Toggle the updating state
  };

  // Store CurrentWeather Snapshot
  const { enqueueSnackbar } = useSnackbar();
  const [storingSnapshot, setStoringSnapshot] = useState(false);
  const handleStoreCurrentWeather = async () => {
    setStoringSnapshot(true);
    try {
      const fetchLatestResponse = await apiRequest.get("/openmeteo/weather");
      setWeatherCurrentData(fetchLatestResponse.data);

      const id = uuidv4();
      const fetchedData = weatherCurrentData.current;

      await apiRequest
        .post("/snapshot/new-snapshot", {
          id,
          interval: fetchedData.interval,
          temperature_2m: fetchedData.temperature_2m,
          time: fetchedData.time,
        })
        .then(() => {
          enqueueSnackbar("Stored Snapshot Successfully!", {
            variant: "success",
          });
        })
        .catch((error) => {
          enqueueSnackbar("Error", {
            variant: "error",
          });
          console.log(error);
        })
        .finally(() => {
          setStoringSnapshot(false);
        });
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setStoringSnapshot(false);
    }
  };

  // Today's Forecast
  const [weatherForecastData, setWeatherForecastData] =
    useState<WeatherForecastProps>({
      hourly: {
        time: [],
        temperature_2m: [],
      },
    });
  const [fetchingForecastWeatherData, setFetchingForecastWeatherData] =
    useState(true);
  const [isForecastUpdating, setIsForecastUpdating] = useState(true);
  const fetchWeatherForecastData = async () => {
    try {
      const response = await apiRequest.get("/openmeteo/weather");
      setWeatherForecastData(response.data);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      setFetchingForecastWeatherData(false);
    }
  };
  useEffect(() => {
    fetchWeatherForecastData();

    let interval: NodeJS.Timeout; // Declare interval variable

    if (isForecastUpdating) {
      // Set interval to fetch weather data every 60 seconds
      interval = setInterval(() => {
        fetchWeatherForecastData();
      }, 60000); // 60,000 milliseconds = 60 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isForecastUpdating]);

  const toggleForecastUpdate = () => {
    setIsForecastUpdating((prev) => !prev); // Toggle the updating state
  };

  console.log(weatherCurrentData);

  return (
    <div className="Home__container">
      <div className="WeatherToday__container">
        <div className="WeatherToday--title__container">
          <h1 className="WeatherToday--title">Current Weather</h1>
          <div className="toggle-switch__container">
            <label className="toggle-switch__label">
              <input
                type="checkbox"
                className="toggle-switch__input"
                checked={isCurrentUpdating}
                onChange={toggleCurrentUpdate}
              />
              <span className="toggle-switch__slider"></span>
            </label>
            <span
              className={`toggle-switch__status toggle-switch--${
                isCurrentUpdating ? "play" : "pause"
              }`}
            >
              {isCurrentUpdating ? "Play" : "Paused"}
            </span>
          </div>

          <button
            className="WeatherToday--button"
            onClick={handleStoreCurrentWeather}
            disabled={!isLoggedIn || storingSnapshot}
          >
            Store Current Weather
          </button>
        </div>
        {!fetchingCurrentWeatherData ? (
          <div>
            <div>
              Timestamp:{" "}
              {new Date(weatherCurrentData.current.time).toLocaleDateString()}{" "}
              {new Date(weatherCurrentData.current.time).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}
            </div>
            <div>
              Temperature: {weatherCurrentData.current.temperature_2m} °C
            </div>
          </div>
        ) : (
          <p>Fetching Current Weather...</p>
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
                checked={isForecastUpdating}
                onChange={toggleForecastUpdate}
              />
              <span className="toggle-switch__slider"></span>
            </label>
            <span
              className={`toggle-switch__status toggle-switch--${
                isForecastUpdating ? "play" : "pause"
              }`}
            >
              {isForecastUpdating ? "Play" : "Paused"}
            </span>
          </div>
        </div>

        {!fetchingForecastWeatherData ? (
          <WeatherList weatherForecastData={weatherForecastData} />
        ) : (
          <p>Fetching Forecast Weather...</p>
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
