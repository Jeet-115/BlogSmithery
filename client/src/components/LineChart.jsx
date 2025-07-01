import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export const TrendsLineChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Posts per Month",
        data: data.map((d) => d.count),
        fill: false,
        borderColor: "#00838F",
        tension: 0.2,
      },
    ],
  };

  return <Line data={chartData} />;
};