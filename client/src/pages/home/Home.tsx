import "./Home.scss";
import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";
import WeatherCard from "../../components/weatherCard/WeatherCard";
import WeatherForecastList from "../../components/weatherForecastList/WeatherForecastList";
import WeatherStoredList from "../../components/weatherStoredList/WeatherStoredList";
import {
  WeatherTodayProps,
  WeatherForecastProps,
  WeatherStoredProps,
  WeatherHistoricalProps,
  GeoLocation,
} from "../../config/openmeteo-config";
import { AuthContext } from "../../context/AuthContext";
import ToggleSwitch from "../../components/toggleSwitch/ToggleSwitch";
import HistoricalWeather from "../../components/historicalWeather/HistoricalWeather";

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;

  // Get Longitude and Latitude
  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    latitude: null,
    longitude: null,
  });
  const getCurrentLocation = async (): Promise<void> => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const latitude: number = position.coords.latitude;
          const longitude: number = position.coords.longitude;
          setGeoLocation({ longitude, latitude });
        },
        (error: GeolocationPositionError) => {
          console.error("Error getting location: ", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    getCurrentLocation();

    let interval: NodeJS.Timeout; // Declare interval variable

    if (isCurrentUpdating) {
      // Set interval to fetch weather data every 60 seconds
      interval = setInterval(() => {
        getCurrentLocation();
      }, 60000); // 60,000 milliseconds = 60 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

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
    if (geoLocation.latitude != null && geoLocation.longitude != null) {
      try {
        const response = await apiRequest.post("/openmeteo/weather", {
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
        });
        setWeatherCurrentData(response.data);
      } catch (error) {
        console.error("Failed to fetch weather data", error);
      } finally {
        setFetchingCurrentWeatherData(false);
      }
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
  }, [isCurrentUpdating, geoLocation]);
  const toggleCurrentUpdate = () => {
    setIsCurrentUpdating((prev) => !prev); // Toggle the updating state
  };

  // Store CurrentWeather Snapshot
  const { enqueueSnackbar } = useSnackbar();
  const [storingSnapshot, setStoringSnapshot] = useState(false);
  const handleStoreCurrentWeather = async () => {
    setStoringSnapshot(true);
    try {
      const fetchLatestResponse = await apiRequest.post("/openmeteo/weather", {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      });
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

  // Stored Weather
  const [weatherStoredData, setWeatherStoredData] = useState<
    WeatherStoredProps[] | null
  >([]);
  const [fetchingStoredWeatherData, setFetchingStoredWeatherData] =
    useState(false);
  const fetchStoredWeatherData = async () => {
    setFetchingStoredWeatherData(true);
    if (geoLocation.latitude != null && geoLocation.longitude != null) {
      await apiRequest
        .get("/snapshot/historical-snapshot")
        .then((response) => {
          setWeatherStoredData(response.data);
          if (response.data.length > 1) {
            enqueueSnackbar("Load Snapshots Successfully!", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("No Snapshots Available!", {
              variant: "error",
            });
          }
        })
        .catch((error) => {
          enqueueSnackbar("Error", {
            variant: "error",
          });
          console.log(error);
        })
        .finally(() => {
          setFetchingStoredWeatherData(false);
        });
    }
  };
  const handleStoredReset = () => {
    setWeatherStoredData([]);
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
      const response = await apiRequest.post("/openmeteo/weather", {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      });
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
  }, [isForecastUpdating, geoLocation]);

  const toggleForecastUpdate = () => {
    setIsForecastUpdating((prev) => !prev); // Toggle the updating state
  };

  // Historical Weather
  const [weatherHistoricalData, setWeatherHistoricalData] =
    useState<WeatherHistoricalProps | null>(null);
  const [fetchingHistoricalData, setFetchingHistoricalData] = useState(false);
  const fetchHistoricalData = async () => {
    setFetchingHistoricalData(true);
    await apiRequest
      .post("/openmeteo/historical-weather", {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      })
      .then((res) => {
        setWeatherHistoricalData(res.data);
        enqueueSnackbar("Load Historical Chart Successfully!", {
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
        setFetchingHistoricalData(false);
      });
  };
  const handleHistoricalReset = () => {
    setWeatherHistoricalData(null);
  };

  return (
    <div className="Home__container">
      <div className="WeatherToday__container">
        <div className="WeatherToday--title__container">
          <h1 className="WeatherToday--title">Current Weather</h1>
          <ToggleSwitch
            isUpdating={isCurrentUpdating}
            toggleUpdate={toggleCurrentUpdate}
          />

          <button
            className="WeatherToday--mobileButton"
            onClick={handleStoreCurrentWeather}
            disabled={!isLoggedIn || storingSnapshot}
          >
            Store
          </button>
          <button
            className="WeatherToday--tabletButton"
            onClick={handleStoreCurrentWeather}
            disabled={!isLoggedIn || storingSnapshot}
          >
            Store Current Weather
          </button>
        </div>
        {!fetchingCurrentWeatherData ? (
          <WeatherCard
            time={weatherCurrentData.current.time}
            temperature={weatherCurrentData.current.temperature_2m}
          />
        ) : (
          <p>Fetching Current Weather...</p>
        )}
      </div>

      <div className="WeatherStored__container">
        <div className="WeatherStored--title__container">
          <h1 className="WeatherStored--title">Stored Weather</h1>
          <button
            className="WeatherStored--mobileButton"
            disabled={!isLoggedIn || fetchingStoredWeatherData}
            onClick={fetchStoredWeatherData}
          >
            Load
          </button>
          <button
            className="WeatherStored--tabletButton"
            disabled={!isLoggedIn || fetchingStoredWeatherData}
            onClick={fetchStoredWeatherData}
          >
            Load 5 Recent Readings
          </button>
          <button
            className="WeatherStored--resetButton"
            onClick={handleStoredReset}
          >
            Clear
          </button>
        </div>
        {weatherStoredData ? (
          <WeatherStoredList weatherStoredData={weatherStoredData} />
        ) : (
          ""
        )}
      </div>

      <div className="WeatherForecast__container">
        <div className="WeatherForecast--title__container">
          <h1 className="WeatherForecast--title">Today's Forecast</h1>
          <ToggleSwitch
            isUpdating={isForecastUpdating}
            toggleUpdate={toggleForecastUpdate}
          />
        </div>

        {!fetchingForecastWeatherData ? (
          <WeatherForecastList weatherForecastData={weatherForecastData} />
        ) : (
          <p>Fetching Forecast Weather...</p>
        )}
      </div>

      <HistoricalWeather
        fetchHistoricalData={fetchHistoricalData}
        fetchingHistoricalData={fetchingHistoricalData}
        handleHistoricalReset={handleHistoricalReset}
        weatherHistoricalData={weatherHistoricalData}
      />
    </div>
  );
};

export default Home;
