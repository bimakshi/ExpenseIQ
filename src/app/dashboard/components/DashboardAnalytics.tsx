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
        <section className="eq-section">
            <div className="eq-section-heading">
                <h2 className="eq-section-title eq-section-title-large">
                    Analytics
                </h2>
                <p className="eq-section-description">
                    Insights into your spending habits and trends
                </p>
            </div>

            {isLoading ? (
                <div className="eq-analytics-grid">
                    <div className="eq-analytics-skeleton eq-analytics-main" />
                    <div className="eq-analytics-skeleton" />
                </div>
            ) : error ? (
                <div className="eq-alert-error">
                    <p className="m-0 text-base font-medium">
                        {error}
                    </p>
                </div>
            ) : (
                <div className="eq-analytics-grid">
                    <div className="eq-analytics-panel eq-analytics-main">
                        <div className="eq-analytics-panel-heading">
                            <h3 className="eq-section-title">
                                Monthly Trend
                            </h3>
                            <p className="eq-section-description">
                                6-month spending overview
                            </p>
                        </div>

                        <div className="eq-chart-area">
                            <MonthlySpendingChart
                                data={monthlyData}
                            />
                        </div>
                    </div>

                    <div className="eq-analytics-panel">
                        <div className="eq-analytics-panel-heading eq-category-chart-heading">
                            <div>
                                <h3 className="eq-section-title">
                                    By Category
                                </h3>
                                <p className="eq-section-description">
                                    {monthNames[selectedMonth - 1]} {selectedYear}
                                </p>
                            </div>

                            <div className="eq-filter-control">
                                <select
                                    id="analytics-month"
                                    aria-label="Select month for category spending"
                                    value={selectedMonth}
                                    onChange={(event) =>
                                        setSelectedMonth(
                                            Number(event.target.value)
                                        )
                                    }
                                    className="eq-select w-full"
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

                        <div className="eq-chart-area eq-category-chart-area">
                            <CategorySpendingChart
                                data={categoryData}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
