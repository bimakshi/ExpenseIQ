"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CategorySpending = {
  category: string;
  amount: number;
};

const COLORS = ["#059669", "#10b981", "#047857", "#34d399", "#065f46", "#6ee7b7", "#a7f3d0"];

type CategorySpendingChartProps = {
  data: CategorySpending[];
};

export default function CategorySpendingChart({
  data,
}: CategorySpendingChartProps) {
  if (data.length === 0) {
    return (
      <div className="eq-chart-empty">
        No spending data available for this month.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
            labelLine={{ stroke: "#a8a29e" }}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => `Rs. ${Number(value).toFixed(2)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
