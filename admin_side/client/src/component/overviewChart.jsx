import React, { useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const LollipopChart = ({ statusGroupschart }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = Object.values(statusGroupschart)
    .sort((a, b) => b.cnt - a.cnt)
    .map((item) => ({
      title: item.name,
      value: item.cnt,
      color: item.color || "#4F46E5",
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100">
          <p className="font-bold text-gray-800">{payload[0].payload.title}</p>
          <p className="text-lg" style={{ color: payload[0].payload.color }}>
            {`${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full p-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          layout="vertical"
          margin={{ top: 15, right: 80, left: 80, bottom: 15 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="title"
            type="category"
            stroke="#94a3b8"
            tick={{ fontSize: 12, fill: "#334155", fontWeight: 500 }}
            width={10}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(224, 231, 255, 0.2)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#e2e8f0"
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={true}
          />

          <Scatter
            dataKey="value"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={activeIndex === index ? "#fff" : entry.color}
                strokeWidth={activeIndex === index ? 2 : 0}
                r={activeIndex === index ? 9 : 7}
              />
            ))}
          </Scatter>
          <Scatter
            dataKey="value"
            shape={(props) => {
              const { cx, cy, payload } = props;
              return (
                <text
                  x={cx + 12}
                  y={cy}
                  textAnchor="start"
                  fill="#334155"
                  fontSize={12}
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  {`${payload.value}%`}
                </text>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LollipopChart;
