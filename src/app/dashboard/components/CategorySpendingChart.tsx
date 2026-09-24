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

type CategorySpendingChartProps = {
  data: CategorySpending[];
};

export default function CategorySpendingChart({
  data,
}: CategorySpendingChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-gray-500">
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
          >
            {data.map((entry) => (
              <Cell key={entry.category} />
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