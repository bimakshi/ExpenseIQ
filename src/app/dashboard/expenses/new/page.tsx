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
    <main className="eq-main">
      <div className="eq-form-content">
        <div className="eq-page-heading">
          <h1 className="eq-page-title">Add Expense</h1>
          <p className="eq-page-description">
            Record a new expense to keep your spending up to date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="eq-form-card"
        >
          <div className="eq-field">
            <label
              htmlFor="amount"
              className="eq-label"
            >
              Amount
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-gray-500 font-medium">Rs.</span>
              </div>
              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
                placeholder="0.00"
                className="eq-input eq-amount-input"
              />
            </div>
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
              disabled={isLoadingCategories}
              className="eq-select w-full"
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

          <div className="eq-field">
            <label
              htmlFor="date"
              className="eq-label"
            >
              Date
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="eq-input"
            />
          </div>

          <div className="eq-field">
            <label
              htmlFor="note"
              className="eq-label"
            >
              Note <span className="font-normal text-gray-400">(Optional)</span>
            </label>

            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="What was this expense for?"
              className="eq-input eq-textarea"
            />
          </div>

          {error && (
            <div className="eq-alert-error">
              <p className="m-0 text-base font-medium" role="alert">
                {error}
              </p>
            </div>
          )}

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
              disabled={isSubmitting || isLoadingCategories}
              className="eq-btn-primary"
            >
              {isSubmitting ? "Saving..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
