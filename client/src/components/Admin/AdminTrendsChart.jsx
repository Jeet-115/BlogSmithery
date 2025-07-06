import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const AdminTrendsChart = ({ data }) => {
  return (
    <motion.div
      className="bg-white/80 p-6 rounded-2xl border border-[#CFD8DC] shadow-md overflow-hidden"
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
        📈 Monthly Publishing Trends
      </motion.h3>

      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#ECEFF1" />
            <XAxis
              dataKey="_id"
              stroke="#607D8B"
              tick={{ fontSize: 12, fill: "#546E7A" }}
            />
            <YAxis
              allowDecimals={false}
              stroke="#607D8B"
              tick={{ fontSize: 12, fill: "#546E7A" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffffdd",
                borderRadius: "8px",
                border: "1px solid #CFD8DC",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#00838F" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#00838F"
              strokeWidth={3}
              activeDot={{ r: 6, stroke: "#00ACC1", strokeWidth: 2 }}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AdminTrendsChart;
