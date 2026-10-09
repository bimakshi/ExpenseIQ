"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import DeleteBudgetButton from "./DeleteBudgetButton";

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
    spent: number;
    percentage: number;
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

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [monthlyLimit, setMonthlyLimit] = useState("");
    const [month, setMonth] = useState(
        String(new Date().getMonth() + 1)
    );
    const [year, setYear] = useState(
        String(new Date().getFullYear())
    );
    const [categoryId, setCategoryId] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadData() {
        try {
            setError("");

            const [budgetsResponse, categoriesResponse] =
                await Promise.all([
                    fetch("/api/budgets"),
                    fetch("/api/categories"),
                ]);

            if (
                !budgetsResponse.ok ||
                !categoriesResponse.ok
            ) {
                throw new Error("Failed to load data.");
            }

            const budgetsData = await budgetsResponse.json();
            const categoriesData =
                await categoriesResponse.json();

            setBudgets(budgetsData);
            setCategories(categoriesData);
        } catch {
            setError(
                "Failed to load budgets. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (Number(monthlyLimit) <= 0) {
            setError(
                "Monthly limit must be greater than zero."
            );
            return;
        }

        if (!categoryId) {
            setError("Please select a category.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch("/api/budgets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    monthlyLimit: Number(monthlyLimit),
                    month: Number(month),
                    year: Number(year),
                    categoryId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                        "Failed to create budget."
                );
                return;
            }

            // Add the newly created budget to the list
            // with initial spending values.
            const newBudget: Budget = {
                ...data.budget,
                spent: 0,
                percentage: 0,
            };

            setBudgets((currentBudgets) => [
                newBudget,
                ...currentBudgets,
            ]);

            setMonthlyLimit("");
            setCategoryId("");
            setSuccess(
                "Budget created successfully."
            );
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="eq-main">
            <div className="eq-content">
                {/* Page Header */}
                <div className="eq-page-heading">
                    <h1 className="eq-page-title">
                        Budgets
                    </h1>

                    <p className="eq-page-description">
                        Set monthly spending limits for your categories
                    </p>
                </div>

                <div className="eq-budget-layout">
                    {/* Add Budget */}
                    <section className="eq-budget-form-panel">
                        <div className="eq-budget-form-heading">
                            <h2 className="eq-section-title">Add Budget</h2>
                            <p className="eq-budget-form-note">Set a monthly spending limit for a single category.</p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="eq-budget-form"
                        >
                            {/* Category */}
                            <div className="eq-field">
                                <label htmlFor="budget-category" className="eq-label">
                                    Category
                                </label>

                                <select
                                    id="budget-category"
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(
                                            event.target.value
                                        )
                                    }
                                    className="eq-select w-full"
                                    required
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {category.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Monthly Limit */}
                            <div className="eq-field">
                                <label htmlFor="monthly-limit" className="eq-label">
                                    Monthly Limit (Rs.)
                                </label>

                                <input
                                    id="monthly-limit"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={monthlyLimit}
                                    onChange={(event) =>
                                        setMonthlyLimit(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. 20000"
                                    className="eq-input"
                                    required
                                />
                            </div>

                            {/* Month */}
                            <div className="eq-field">
                                <label htmlFor="budget-month" className="eq-label">
                                    Month
                                </label>

                                <select
                                    id="budget-month"
                                    value={month}
                                    onChange={(event) =>
                                        setMonth(
                                            event.target.value
                                        )
                                    }
                                    className="eq-select w-full"
                                >
                                    {monthNames.map(
                                        (
                                            monthName,
                                            index
                                        ) => (
                                            <option
                                                key={
                                                    monthName
                                                }
                                                value={
                                                    index + 1
                                                }
                                            >
                                                {monthName}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Year */}
                            <div className="eq-field">
                                <label htmlFor="budget-year" className="eq-label">
                                    Year
                                </label>

                                <input
                                    id="budget-year"
                                    type="number"
                                    min="2000"
                                    value={year}
                                    onChange={(event) =>
                                        setYear(
                                            event.target.value
                                        )
                                    }
                                    className="eq-input"
                                />
                            </div>

                            {/* Messages */}
                            {error && (
                                <p className="eq-alert-error">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="eq-alert-success">
                                    {success}
                                </p>
                            )}

                            {/* Submit */}
                            <div className="eq-budget-form-actions">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="eq-btn-primary"
                                >
                                    {isSaving
                                        ? "Creating..."
                                        : "Create Budget"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Budget List */}
                    <section className="eq-budget-list-panel">
                        <div className="eq-budget-list-heading">
                            <div>
                                <h2 className="eq-section-title">Your Budgets</h2>
                                <p className="eq-budget-list-note">Spending progress against each monthly limit</p>
                            </div>
                            {!isLoading && budgets.length > 0 && (
                                <span className="eq-budget-count">{budgets.length} {budgets.length === 1 ? "budget" : "budgets"}</span>
                            )}
                        </div>

                        {isLoading ? (
                            <p className="eq-inline-message">
                                Loading budgets…
                            </p>
                        ) : budgets.length === 0 ? (
                            <div className="eq-budget-empty">
                                <div className="eq-budget-empty-icon" aria-hidden="true">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
                                    </svg>
                                </div>
                                <p className="eq-budget-empty-title">No budgets yet</p>
                                <p className="eq-inline-message">Create a monthly limit above to start tracking category spending.</p>
                            </div>
                        ) : (
                            <div className="eq-budget-items">
                                {budgets.map(
                                    (budget) => (
                                        <div
                                            key={
                                                budget.id
                                            }
                                            className="eq-budget-item"
                                        >
                                            {/* Top row: header + actions */}
                                            <div className="eq-budget-item-top">
                                                <div className="eq-budget-item-header">
                                                    <p className="eq-budget-category">
                                                        {budget.category.name}
                                                    </p>
                                                    <p className="eq-budget-period">
                                                        {monthNames[budget.month - 1]}{" "}{budget.year}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="eq-budget-actions">
                                                    <Link
                                                        href={`/dashboard/budgets/${budget.id}/edit`}
                                                        className="eq-action-link"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <DeleteBudgetButton
                                                        budgetId={budget.id}
                                                        onDeleted={(deletedId) => {
                                                            setBudgets(
                                                                (currentBudgets) =>
                                                                    currentBudgets.filter(
                                                                        (item) =>
                                                                            item.id !==
                                                                            deletedId
                                                                    )
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Metric strip */}
                                            <div className="eq-budget-metrics">
                                                <div className="eq-budget-metric">
                                                    <span className="eq-budget-metric-label">Spent</span>
                                                    <strong className="eq-budget-metric-value">Rs. {budget.spent.toFixed(2)}</strong>
                                                </div>
                                                <div className="eq-budget-metric">
                                                    <span className="eq-budget-metric-label">{budget.spent > budget.monthlyLimit ? "Over budget" : "Remaining"}</span>
                                                    <strong className={`eq-budget-metric-value ${budget.spent > budget.monthlyLimit ? "is-over" : ""}`}>
                                                        Rs. {Math.abs(budget.monthlyLimit - budget.spent).toFixed(2)}
                                                    </strong>
                                                </div>
                                                <div className="eq-budget-metric">
                                                    <span className="eq-budget-metric-label">Monthly limit</span>
                                                    <strong className="eq-budget-metric-value">Rs. {budget.monthlyLimit.toFixed(2)}</strong>
                                                </div>
                                            </div>

                                            {/* Spending progress */}
                                            <div className="eq-budget-spending">
                                                <div className="eq-budget-progress-heading">
                                                    <span className="eq-budget-progress-label">Budget used</span>
                                                    <span className="eq-budget-percent">{budget.percentage.toFixed(1)}%</span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div
                                                    className="eq-budget-progress"
                                                    role="progressbar"
                                                    aria-label={`${budget.category.name} budget used`}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={Math.min(budget.percentage, 100)}
                                                >
                                                    <div
                                                        className={`eq-budget-progress-value ${
                                                            budget.percentage >= 100
                                                                ? "is-exceeded"
                                                                : budget.percentage >= 80
                                                                  ? "is-warning"
                                                                  : "is-healthy"
                                                        }`}
                                                        style={{
                                                            width: `${Math.min(
                                                                budget.percentage,
                                                                100
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Budget Alert */}
                                            {budget.percentage >= 100 ? (
                                                <div className="eq-budget-alert is-exceeded" role="status">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                    Budget exceeded by Rs. {(budget.spent - budget.monthlyLimit).toFixed(2)}.
                                                </div>
                                            ) : budget.percentage >= 80 ? (
                                                <div className="eq-budget-alert is-warning" role="status">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                    You have used {budget.percentage.toFixed(1)}% of this budget.
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
