import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryPieChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: [
          "#00838F",
          "#00ACC1",
          "#26C6DA",
          "#4DD0E1",
          "#80DEEA",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};