import "./HistoricalWeather.scss";
import HistoricalChart from "../../components/historicalChart/HistoricalChart";
import { WeatherHistoricalProps } from "../../config/openmeteo-config";

interface HistoricalWeatherProps {
  weatherHistoricalData: WeatherHistoricalProps | null; // Replace `any` with the actual type if you have it
  fetchingHistoricalData: boolean;
  fetchHistoricalData: () => void;
  handleHistoricalReset: () => void;
}

const HistoricalWeather: React.FC<HistoricalWeatherProps> = ({
  fetchHistoricalData,
  fetchingHistoricalData,
  handleHistoricalReset,
  weatherHistoricalData,
}) => {
  return (
    <div className="WeatherHistorical__container">
      <div className="WeatherHistorical--title__container">
        <h1 className="WeatherHistorical--title">Historical Weather</h1>
        <button
          className="WeatherHistorical--mobileButton"
          onClick={fetchHistoricalData}
          disabled={fetchingHistoricalData}
        >
          Load
        </button>

        <button
          className="WeatherHistorical--tabletButton"
          onClick={fetchHistoricalData}
          disabled={fetchingHistoricalData}
        >
          Load Historical Chart
        </button>

        <button
          className="WeatherHistorical--resetButton"
          onClick={handleHistoricalReset}
        >
          Clear
        </button>
      </div>
      {weatherHistoricalData ? (
        <HistoricalChart
          dates={weatherHistoricalData.daily.time}
          maxTemperatures={weatherHistoricalData.daily.temperature_2m_max}
          minTemperatures={weatherHistoricalData.daily.temperature_2m_min}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default HistoricalWeather;
