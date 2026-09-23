"use client";

import { useState } from "react";

type DeleteBudgetButtonProps = {
  budgetId: string;
  onDeleted: (budgetId: string) => void;
};

export default function DeleteBudgetButton({
  budgetId,
  onDeleted,
}: DeleteBudgetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: budgetId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.message || "Failed to delete budget.");
        return;
      }

      onDeleted(budgetId);
    } catch {
      window.alert("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}