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
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-gray-600">Loading expense...</p>
        </div>
      </main>
    );
  }

  if (error && !expense) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold">Edit Expense</h1>

        <p className="mt-1 text-sm text-gray-600">
          Update your expense details
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border bg-white p-6"
        >
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Amount</label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Category</label>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
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

          <div className="mt-5">
            <label className="text-sm font-medium">Date</label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Note</label>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
              placeholder="Optional note"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border px-5 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}