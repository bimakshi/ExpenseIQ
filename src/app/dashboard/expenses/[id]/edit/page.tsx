"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note: string | null;
};

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();

  const expenseId = params.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [expensesResponse, categoriesResponse] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/categories"),
        ]);

        if (!expensesResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to load expense data.");
        }

        const expenses = await expensesResponse.json();
        const categoriesData = await categoriesResponse.json();

        const selectedExpense = expenses.find(
          (item: Expense) => item.id === expenseId
        );

        if (!selectedExpense) {
          setError("Expense not found.");
          return;
        }

        setExpense(selectedExpense);
        setCategories(categoriesData);

        setAmount(String(selectedExpense.amount));
        setCategoryId(selectedExpense.categoryId);
        setDate(selectedExpense.date.split("T")[0]);
        setNote(selectedExpense.note || "");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [expenseId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: expenseId,
          amount,
          categoryId,
          date,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update expense.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="eq-main">
        <div className="eq-form-content">
          <div className="eq-loading-state">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p>Loading expense details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !expense) {
    return (
      <main className="eq-main">
        <div className="eq-form-content">
          <div className="eq-alert-error">
            <p className="m-0 text-base font-medium">{error}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="eq-action-link"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="eq-main">
      <div className="eq-form-content">
        <div className="eq-page-heading">
          <h1 className="eq-page-title">Edit Expense</h1>
          <p className="eq-page-description">
            Update the details for this expense.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="eq-form-card"
        >
          {error && (
            <div className="eq-alert-error">
              <p className="m-0 text-base font-medium" role="alert">
                {error}
              </p>
            </div>
          )}

          <div className="eq-field">
            <label htmlFor="amount" className="eq-label">Amount</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-gray-500 font-medium">Rs.</span>
              </div>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="eq-input eq-amount-input"
                required
              />
            </div>
          </div>

          <div className="eq-field">
            <label htmlFor="category" className="eq-label">Category</label>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              id="category"
              className="eq-select w-full"
              required
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
            <label htmlFor="date" className="eq-label">Date</label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              id="date"
              className="eq-input"
              required
            />
          </div>

          <div className="eq-field">
            <label htmlFor="note" className="eq-label">
              Note <span className="font-normal text-gray-400">(Optional)</span>
            </label>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              id="note"
              className="eq-input eq-textarea"
              placeholder="What was this expense for?"
            />
          </div>

          <div className="eq-form-actions">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="eq-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="eq-btn-primary"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
