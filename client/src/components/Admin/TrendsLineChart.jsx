import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const TrendsLineChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        label: "Published Posts",
        data: data.map((d) => d.count),
        borderColor: "#00838F",
        backgroundColor: "#00ACC1",
        fill: true,
        tension: 0.3,
        pointBorderColor: "#00838F",
        pointBackgroundColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#37474F",
          font: {
            family: "Outfit",
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        bodyColor: "#00838F",
        titleColor: "#1C2B33",
        borderColor: "#B0BEC5",
        borderWidth: 1,
        titleFont: {
          family: "Outfit",
          size: 13,
        },
        bodyFont: {
          family: "Outfit",
          size: 13,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#37474F",
          font: {
            family: "Outfit",
          },
        },
        grid: {
          color: "#ECEFF1",
        },
      },
      y: {
        ticks: {
          color: "#37474F",
          font: {
            family: "Outfit",
          },
        },
        grid: {
          color: "#ECEFF1",
        },
      },
    },
  };

  return (
    <motion.div
      className="bg-white/90 p-6 rounded-2xl shadow-md border border-[#CFD8DC] w-full max-w-3xl h-[400px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <motion.h3
        className="text-lg sm:text-xl font-semibold text-[#1C2B33] mb-4 outfit"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        📊 Monthly Publishing Trends
      </motion.h3>

      <div className="w-full h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

export default TrendsLineChart;
