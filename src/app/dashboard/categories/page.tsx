"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    try {
      setError("");

      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("Failed to load categories.");
      }

      const data = await response.json();

      setCategories(data);
    } catch {
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create category.");
        return;
      }

      setCategories((currentCategories) => [
        ...currentCategories,
        data.category,
      ]);

      setName("");
      setSuccess("Category created successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage your expense categories
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <section className="rounded-xl border bg-white p-6 md:col-span-1">
            <h2 className="text-lg font-semibold">Add Category</h2>

            <form onSubmit={handleSubmit} className="mt-5">
              <label className="text-sm font-medium">
                Category name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Travel"
                className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
              />

              {error && (
                <p className="mt-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="mt-3 text-sm text-emerald-600">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSaving ? "Adding..." : "Add Category"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border bg-white p-6 md:col-span-2">
            <h2 className="text-lg font-semibold">Your Categories</h2>

            {isLoading ? (
              <p className="mt-5 text-sm text-gray-600">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="mt-5 text-sm text-gray-600">
                No categories found.
              </p>
            ) : (
              <div className="mt-5 divide-y">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="font-medium">
                      {category.name}
                    </span>

                    <span className="text-xs text-gray-500">
                      Category
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}