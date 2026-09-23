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
        <main className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-5xl">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-semibold">
                        Budgets
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Set monthly spending limits for
                        your categories
                    </p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {/* Add Budget */}
                    <section className="rounded-xl border bg-white p-6">
                        <h2 className="text-lg font-semibold">
                            Add Budget
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-5"
                        >
                            {/* Category */}
                            <div>
                                <label className="text-sm font-medium">
                                    Category
                                </label>

                                <select
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
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
                            <div className="mt-5">
                                <label className="text-sm font-medium">
                                    Monthly Limit
                                </label>

                                <input
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
                                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
                                    required
                                />
                            </div>

                            {/* Month */}
                            <div className="mt-5">
                                <label className="text-sm font-medium">
                                    Month
                                </label>

                                <select
                                    value={month}
                                    onChange={(event) =>
                                        setMonth(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
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
                            <div className="mt-5">
                                <label className="text-sm font-medium">
                                    Year
                                </label>

                                <input
                                    type="number"
                                    min="2000"
                                    value={year}
                                    onChange={(event) =>
                                        setYear(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-emerald-600"
                                />
                            </div>

                            {/* Messages */}
                            {error && (
                                <p className="mt-4 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="mt-4 text-sm text-emerald-600">
                                    {success}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {isSaving
                                    ? "Creating..."
                                    : "Create Budget"}
                            </button>
                        </form>
                    </section>

                    {/* Budget List */}
                    <section className="rounded-xl border bg-white p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold">
                            Your Budgets
                        </h2>

                        {isLoading ? (
                            <p className="mt-5 text-sm text-gray-600">
                                Loading budgets...
                            </p>
                        ) : budgets.length === 0 ? (
                            <p className="mt-5 text-sm text-gray-600">
                                No budgets created yet.
                            </p>
                        ) : (
                            <div className="mt-5 divide-y">
                                {budgets.map(
                                    (budget) => (
                                        <div
                                            key={
                                                budget.id
                                            }
                                            className="py-5"
                                        >
                                            {/* Budget Header */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            budget
                                                                .category
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {
                                                            monthNames[
                                                                budget
                                                                    .month -
                                                                    1
                                                            ]
                                                        }{" "}
                                                        {
                                                            budget.year
                                                        }
                                                    </p>
                                                </div>

                                                <p className="font-semibold">
                                                    Rs.{" "}
                                                    {budget.monthlyLimit.toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>

                                            {/* Spending */}
                                            <div className="mt-4">
                                                <div className="mb-1 flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Spent
                                                    </span>

                                                    <span className="font-medium text-gray-900">
                                                        Rs.{" "}
                                                        {budget.spent.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            budget.percentage >=
                                                            100
                                                                ? "bg-red-500"
                                                                : budget.percentage >=
                                                                    80
                                                                  ? "bg-amber-500"
                                                                  : "bg-emerald-500"
                                                        }`}
                                                        style={{
                                                            width: `${Math.min(
                                                                budget.percentage,
                                                                100
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>

                                                <p className="mt-1 text-right text-xs text-gray-500">
                                                    {budget.percentage.toFixed(
                                                        1
                                                    )}
                                                    % used
                                                </p>
                                            </div>

                                            {/* Budget Alert */}
                                            {budget.percentage >=
                                            100 ? (
                                                <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                                    Budget
                                                    exceeded
                                                    by Rs.{" "}
                                                    {(
                                                        budget.spent -
                                                        budget.monthlyLimit
                                                    ).toFixed(
                                                        2
                                                    )}
                                                    .
                                                </div>
                                            ) : budget.percentage >=
                                              80 ? (
                                                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                                                    You
                                                    have
                                                    used{" "}
                                                    {budget.percentage.toFixed(
                                                        1
                                                    )}
                                                    % of
                                                    this
                                                    budget.
                                                </div>
                                            ) : null}

                                            {/* Actions */}
                                            <div className="mt-3 flex gap-3">
                                                <Link
                                                    href={`/dashboard/budgets/${budget.id}/edit`}
                                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                                >
                                                    Edit
                                                </Link>

                                                <DeleteBudgetButton
                                                    budgetId={
                                                        budget.id
                                                    }
                                                    onDeleted={(
                                                        deletedId
                                                    ) => {
                                                        setBudgets(
                                                            (
                                                                currentBudgets
                                                            ) =>
                                                                currentBudgets.filter(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.id !==
                                                                        deletedId
                                                                )
                                                        );
                                                    }}
                                                />
                                            </div>
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