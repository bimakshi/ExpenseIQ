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
    <main className="eq-main">
      <div className="eq-content eq-categories-content">
        <div className="eq-page-heading">
          <h1 className="eq-page-title">Categories</h1>

          <p className="eq-page-description">
            Manage your expense categories
          </p>
        </div>

        <div className="eq-category-layout">
          {/* Add Category */}
          <section className="eq-category-form-panel">
            <div className="eq-category-form-copy">
              <h2 className="eq-section-title">Add Category</h2>
              <p className="eq-category-note">Create a category to keep your expense records organized.</p>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="eq-category-form">
                <div className="eq-field">
                  <label htmlFor="category-name" className="eq-label">
                    Category name
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Travel"
                    className="eq-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="eq-btn-primary"
                >
                  {isSaving ? "Adding…" : "Add Category"}
                </button>
              </form>

              {error && (
                <p className="eq-alert-error eq-category-form-alert" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="eq-alert-success eq-category-form-alert" role="status">
                  {success}
                </p>
              )}
            </div>
          </section>

          {/* Category List */}
          <section className="eq-category-list-panel">
            <div className="eq-category-list-heading">
              <div>
                <h2 className="eq-section-title">Your Categories</h2>
                <p className="eq-category-note">Used to organize and filter your expenses</p>
              </div>
              {!isLoading && categories.length > 0 && (
                <span className="eq-category-count">{categories.length} {categories.length === 1 ? "category" : "categories"}</span>
              )}
            </div>

            {isLoading ? (
              <p className="eq-inline-message" role="status">
                Loading categories…
              </p>
            ) : categories.length === 0 ? (
              <div className="eq-category-empty">
                <div className="eq-category-empty-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <p className="eq-category-empty-title">No categories yet</p>
                <p className="eq-inline-message">Add a category above to start organizing your expenses.</p>
              </div>
            ) : (
              <ul className="eq-category-list">
                {categories.map((category, index) => (
                  <li
                    key={category.id}
                    className="eq-category-row"
                  >
                    <span className="eq-category-index" aria-hidden="true">{index + 1}</span>
                    <span className="eq-category-name">
                      {category.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
