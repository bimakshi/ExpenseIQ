"use client";

import { useEffect, useState } from "react";
import DeleteExpenseButton from "../expenses/DeleteExpenseButton";

type Expense = {
  id: string;
  amount: number;
  note: string | null;
  date: string;
  category: { id: string; name: string };
};

type Category = { id: string; name: string };

type DashboardExpenseListProps = {
  expenses: Expense[];
  onExpenseDeleted: () => void;
};

export default function DashboardExpenseList({
  expenses,
  onExpenseDeleted,
}: DashboardExpenseListProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load categories.");
        }

        setCategories(result);
      } catch (error) {
        console.error("Load categories error:", error);
      }
    }

    loadCategories();
  }, []);

  const filteredExpenses =
    selectedCategory === "all"
      ? expenses
      : expenses.filter((expense) => expense.category.id === selectedCategory);

  return (
    <section className="eq-section">
      <div className="eq-section-heading eq-activity-heading">
        <div>
          <h2 className="eq-section-title eq-section-title-large">Recent Activity</h2>
          <p className="eq-section-description">Your latest recorded transactions</p>
        </div>

        <div className="eq-list-controls">
          <select
            id="expense-category"
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="eq-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <a href="/dashboard/expenses/new" className="eq-btn-primary">Add Expense</a>
        </div>
      </div>

        <div className="eq-activity-list">
        {filteredExpenses.length === 0 ? (
          <div className="eq-empty-state">
            <div className="eq-empty-state-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <p className="eq-empty-title">No expenses found</p>
            <p className="eq-empty-description">Try changing the category or add a new expense.</p>
          </div>
        ) : (
          <div className="eq-activity-table" role="table" aria-label="Recent activity">
            <div className="eq-activity-table-header" role="row">
              <div className="eq-activity-th" role="columnheader">Category</div>
              <div className="eq-activity-th" role="columnheader">Note</div>
              <div className="eq-activity-th" role="columnheader">Date</div>
              <div className="eq-activity-th eq-activity-th-right" role="columnheader">Amount</div>
              <div className="eq-activity-th eq-activity-th-right" role="columnheader">Actions</div>
            </div>
            <ul className="eq-activity-items" role="rowgroup">
              {filteredExpenses.map((expense) => (
                <li key={expense.id} className="eq-activity-item" role="row">
                  <div className="eq-activity-td eq-activity-category-col" role="cell">
                    <div className="eq-activity-mark" aria-hidden="true">
                      <span>{expense.category.name.charAt(0)}</span>
                    </div>
                    <span className="eq-activity-name">{expense.category.name}</span>
                  </div>

                  <div className="eq-activity-td eq-activity-note-col" role="cell">
                    <span className="eq-activity-note">{expense.note || <span className="eq-muted-text">—</span>}</span>
                  </div>

                  <div className="eq-activity-td eq-activity-date-col" role="cell">
                    <span className="eq-activity-date">
                      {new Date(expense.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <div className="eq-activity-td eq-activity-amount-col" role="cell">
                    <span className="eq-activity-amount">Rs. {expense.amount.toFixed(2)}</span>
                  </div>

                  <div className="eq-activity-td eq-activity-actions-col" role="cell">
                    <div className="eq-activity-actions">
                      <a href={`/dashboard/expenses/${expense.id}/edit`} className="eq-action-link">Edit</a>
                      <DeleteExpenseButton expenseId={expense.id} onDeleted={onExpenseDeleted} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
