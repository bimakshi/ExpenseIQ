"use client";

import { useEffect, useState } from "react";

import DeleteExpenseButton from "../expenses/DeleteExpenseButton";

type Expense = {
  id: string;
  amount: number;
  note: string | null;
  date: string;
  category: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
};

type DashboardExpenseListProps = {
  expenses: Expense[];
  onExpenseDeleted: () => void;
};

export default function DashboardExpenseList({
  expenses,
  onExpenseDeleted,
}: DashboardExpenseListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [categories, setCategories] = useState<Category[]>(
    []
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load categories."
          );
        }

        setCategories(result);
      } catch (error) {
        console.error("Load categories error:", error);
      }
    }

    loadCategories();
  }, []);

  const filteredExpenses =
    selectedCategory === "all"
      ? expenses
      : expenses.filter(
          (expense) =>
            expense.category.id === selectedCategory
        );

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Recent Expenses
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Your latest recorded expenses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            id="expense-category"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <a
            href="/dashboard/expenses/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Add Expense
          </a>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-600">
            No expenses found for this category.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">
                  {expense.category.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {expense.note || "No note"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {new Date(
                    expense.date
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Rs. {expense.amount.toFixed(2)}
                </p>

                <div className="mt-1 flex justify-end gap-3">
                  <a
                    href={`/dashboard/expenses/${expense.id}/edit`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Edit
                  </a>

                  <DeleteExpenseButton
                    expenseId={expense.id}
                    onDeleted={onExpenseDeleted}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}