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
  const fetchWeatherALlData = async () => {
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
    fetchWeatherALlData();
  }, []);

  console.log(weatherAllData);
  return (
    <div>
      {!fetchingWeatherALlData ? (
        <WeatherList weatherAllData={weatherAllData} />
      ) : (
        <p>Fetching Weather...</p>
      )}
    </div>
  );
};

export default Home;
