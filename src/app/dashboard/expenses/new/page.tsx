"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

export default function NewExpensePage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to load categories.");
        }

        const data = await response.json();
        setCategories(data);
      } catch {
        setError("Unable to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          categoryId,
          date,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create expense.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Add Expense</h1>
          <p className="mt-2 text-sm text-gray-600">
            Record a new expense to keep your spending up to date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-white p-6"
        >
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium"
            >
              Amount
            </label>

            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              placeholder="0.00"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              Category
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
              disabled={isLoadingCategories}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium"
            >
              Date
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="mb-2 block text-sm font-medium"
            >
              Note
            </label>

            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Optional note"
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoadingCategories}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Add Expense"}
          </button>
        </form>
      </div>
    </main>
  );
}