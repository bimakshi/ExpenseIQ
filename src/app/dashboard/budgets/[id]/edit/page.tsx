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
      <main className="eq-main">
        <div className="eq-form-content"><p className="eq-inline-message">Loading budget...</p></div>
      </main>
    );
  }

  if (error && !monthlyLimit) {
    return (
      <main className="eq-main">
        <div className="eq-form-content"><p className="eq-alert-error">{error}</p></div>
      </main>
    );
  }

  return (
    <main className="eq-main">
      <div className="eq-form-content">
        <div className="eq-page-heading">
        <h1 className="eq-page-title">Edit Budget</h1>
        <p className="eq-page-description">
          Update your monthly budget.
        </p>
        </div>

      <form
        onSubmit={handleSubmit}
        className="eq-form-card"
      >
        {error && (
          <div className="eq-alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="eq-field">
          <label
            htmlFor="monthlyLimit"
            className="eq-label"
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
            className="eq-input"
          />
        </div>

        <div className="eq-field">
          <label
            htmlFor="category"
            className="eq-label"
          >
            Category
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
            className="eq-select w-full"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="eq-field">
          <label
            htmlFor="month"
            className="eq-label"
          >
            Month
          </label>

          <select
            id="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            required
            className="eq-select w-full"
          >
            <option value="">Select month</option>

            {monthNames.map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>

        <div className="eq-field">
          <label
            htmlFor="year"
            className="eq-label"
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
            className="eq-input"
          />
        </div>

        <div className="eq-form-actions">
          <button
            type="button"
            onClick={() => router.push("/dashboard/budgets")}
            className="eq-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="eq-btn-primary"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}
