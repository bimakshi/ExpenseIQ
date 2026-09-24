"use client";

import { useEffect, useState } from "react";

import CategorySpendingChart from "./CategorySpendingChart";
import MonthlySpendingChart from "./MonthlySpendingChart";

type CategorySpending = {
    category: string;
    amount: number;
};

type MonthlySpending = {
    month: string;
    year: number;
    amount: number;
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

type DashboardAnalyticsProps = {
    refreshKey: number;
};

export default function DashboardAnalytics({
    refreshKey,
}: DashboardAnalyticsProps) {
    const now = new Date();

    const [selectedMonth, setSelectedMonth] = useState(
        now.getMonth() + 1
    );

    const [selectedYear, setSelectedYear] = useState(
        now.getFullYear()
    );

    const [categoryData, setCategoryData] = useState<
        CategorySpending[]
    >([]);

    const [monthlyData, setMonthlyData] = useState<
        MonthlySpending[]
    >([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAnalytics() {
            try {
                setIsLoading(true);
                setError("");

                const categoryUrl =
                    `/api/dashboard/category-spending?month=${selectedMonth}&year=${selectedYear}`;

                const [categoryResponse, monthlyResponse] =
                    await Promise.all([
                        fetch(categoryUrl),
                        fetch("/api/dashboard/monthly-spending"),
                    ]);

                const categoryResult = await categoryResponse.json();
                const monthlyResult = await monthlyResponse.json();

                if (!categoryResponse.ok) {
                    throw new Error(
                        categoryResult.message ||
                            "Failed to load category spending."
                    );
                }

                if (!monthlyResponse.ok) {
                    throw new Error(
                        monthlyResult.message ||
                            "Failed to load monthly spending."
                    );
                }

                setCategoryData(categoryResult);
                setMonthlyData(monthlyResult);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading analytics."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadAnalytics();
    }, [selectedMonth, selectedYear, refreshKey]);

    return (
        <section className="mb-8">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Spending Analytics
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Overview of your spending patterns
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="h-96 animate-pulse rounded-xl border bg-gray-100" />

                    <div className="h-96 animate-pulse rounded-xl border bg-gray-100" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-white p-6">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    Spending by Category
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Spending for{" "}
                                    {monthNames[selectedMonth - 1]}{" "}
                                    {selectedYear}
                                </p>
                            </div>

                            <div>
                                <select
                                    id="analytics-month"
                                    value={selectedMonth}
                                    onChange={(event) =>
                                        setSelectedMonth(
                                            Number(event.target.value)
                                        )
                                    }
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                >
                                    {monthNames.map((month, index) => (
                                        <option
                                            key={month}
                                            value={index + 1}
                                        >
                                            {month} {selectedYear}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <CategorySpendingChart
                            data={categoryData}
                        />
                    </div>

                    <div className="rounded-xl border bg-white p-6">
                        <div className="mb-4">
                            <h3 className="font-semibold">
                                Monthly Spending
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Spending trend over the last 6 months
                            </p>
                        </div>

                        <MonthlySpendingChart
                            data={monthlyData}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}