"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardAnalytics from "./DashboardAnalytics";
import DashboardExpenseList from "./DashboardExpenseList";

type Expense = {
    id: string;
    amount: number;
    note: string | null;
    date: string;
    category: {
        id: string;
        name: string;
    };
};

type DashboardClientProps = {
    expenses: Expense[];
};

export default function DashboardClient({
    expenses,
}: DashboardClientProps) {
    const router = useRouter();
    const [refreshKey, setRefreshKey] = useState(0);

    function handleExpenseDeleted() {
        router.refresh();
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <>
            <DashboardAnalytics refreshKey={refreshKey} />

            <DashboardExpenseList
                expenses={expenses}
                onExpenseDeleted={handleExpenseDeleted}
            />
        </>
    );
}