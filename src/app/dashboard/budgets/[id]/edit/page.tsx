"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type Budget = {
  id: string;
  monthlyLimit: number;
  month: number;
  year: number;
  categoryId: string;
  category: Category;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function EditBudgetPage() {
  const params = useParams();
  const router = useRouter();

  const budgetId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [budgetsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/budgets"),
          fetch("/api/categories"),
        ]);

        if (!budgetsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to load budget information.");
        }

        const budgets: Budget[] = await budgetsResponse.json();
        const categoryData: Category[] = await categoriesResponse.json();

        const selectedBudget = budgets.find(
          (budget) => budget.id === budgetId
        );

        if (!selectedBudget) {
          setError("Budget not found.");
          return;
        }

        setCategories(categoryData);
        setMonthlyLimit(String(selectedBudget.monthlyLimit));
        setMonth(String(selectedBudget.month));
        setYear(String(selectedBudget.year));
        setCategoryId(selectedBudget.categoryId);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [budgetId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: budgetId,
          monthlyLimit,
          month,
          year,
          categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update budget.");
        return;
      }

      router.push("/dashboard/budgets");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Loading budget...</p>
      </main>
    );
  }

  if (error && !monthlyLimit) {
    return (
      <main className="p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Budget</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update your monthly budget.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="monthlyLimit"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Monthly Limit
          </label>

          <input
            id="monthlyLimit"
            type="number"
            min="0.01"
            step="0.01"
            value={monthlyLimit}
            onChange={(event) => setMonthlyLimit(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="month"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Month
          </label>

          <select
            id="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="">Select month</option>

            {monthNames.map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Year
          </label>

          <input
            id="year"
            type="number"
            min="2000"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/budgets")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}