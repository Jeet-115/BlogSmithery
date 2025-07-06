import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        label: "Posts",
        data: data.map((d) => d.count),
        backgroundColor: [
          "#00838F",
          "#00ACC1",
          "#4DD0E1",
          "#80DEEA",
          "#B2EBF2",
          "#FF8A65",
          "#FFD54F",
          "#A1887F",
          "#90CAF9",
          "#E1BEE7",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#37474F",
          font: {
            size: 12,
            family: "Outfit",
          },
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        bodyColor: "#00838F",
        borderColor: "#CFD8DC",
        borderWidth: 1,
        bodyFont: {
          family: "Outfit",
        },
      },
    },
  };

  return (
    <motion.div
      className="bg-white/90 p-6 rounded-2xl shadow-md border border-[#CFD8DC] w-full max-w-md mx-auto"
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
        🥧 Category Distribution
      </motion.h3>

      <div className="w-full h-[300px]">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

export default PieChart;
