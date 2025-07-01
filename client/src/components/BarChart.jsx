import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export const WordStatsBarChart = ({ stats }) => {
  const chartData = {
    labels: ["Total Words", "Avg Words/Post"],
    datasets: [
      {
        label: "Word Stats",
        data: [stats.totalWords, stats.averageWords],
        backgroundColor: ["#26C6DA", "#00ACC1"],
      },
    ],
  };

  return <Bar data={chartData} />;
};