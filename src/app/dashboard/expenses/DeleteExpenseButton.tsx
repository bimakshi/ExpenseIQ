"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteExpenseButtonProps = {
  expenseId: string;
  onDeleted?: () => void;
};

export default function DeleteExpenseButton({
  expenseId,
  onDeleted,
}: DeleteExpenseButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: expenseId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        window.alert(data.message || "Failed to delete expense.");
        return;
      }

      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
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