import "./HistoricalChart.scss";
import { Line } from "react-chartjs-2";
import { HistoricalChartProps } from "../../config/openmeteo-config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoricalChart: React.FC<HistoricalChartProps> = ({
  dates,
  maxTemperatures,
  minTemperatures,
}) => {
  // Chart data configuration
  const chartData = {
    labels: dates, // Use dates as labels for the x-axis
    datasets: [
      {
        label: "Max Temperature (°C)",
        data: maxTemperatures, // Use max temperature data
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Min Temperature (°C)",
        data: minTemperatures, // Use min temperature data
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="HistoricalChart__container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HistoricalChart;
