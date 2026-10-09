"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlySpending = {
  month: string;
  year: number;
  amount: number;
};

type MonthlySpendingChartProps = {
  data: MonthlySpending[];
};

export default function MonthlySpendingChart({
  data,
}: MonthlySpendingChartProps) {
  if (data.length === 0) {
    return (
      <div className="eq-chart-empty">
        No monthly spending data available.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid stroke="#e7e5e4" strokeDasharray="2 4" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 13, fill: "#57534e" }}
            axisLine={{ stroke: "#d6d3d1" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 13, fill: "#57534e" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) =>
              `Rs. ${Number(value).toFixed(2)}`
            }
            contentStyle={{ borderColor: "#e7e5e4", borderRadius: "4px", fontSize: 14 }}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#059669"
            strokeWidth={2}
            dot={{ r: 3, fill: "#059669", strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 5, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
