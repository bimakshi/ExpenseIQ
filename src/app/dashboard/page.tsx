import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import LogoutButton from "./LogoutButton";
import DashboardClient from "./components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const currentMonthSpending = expenses
    .filter(
      (expense) =>
        expense.date >= startOfMonth &&
        expense.date < startOfNextMonth
    )
    .reduce(
      (total, expense) => total + expense.amount,
      0
    );

  const currentMonthBudgets = await prisma.budget.aggregate({
    where: {
      userId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
    _sum: {
      monthlyLimit: true,
    },
  });

  const totalBudget =
    currentMonthBudgets._sum.monthlyLimit ?? 0;

  const remainingBudget =
    totalBudget - currentMonthSpending;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Welcome back,{" "}
              {session.user.name || session.user.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <p className="mt-2 text-2xl font-semibold">
              Rs. {totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              This Month Spending
            </p>

            <p className="mt-2 text-2xl font-semibold">
              Rs. {currentMonthSpending.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Budget
            </p>

            <p className="mt-2 text-2xl font-semibold">
              Rs. {totalBudget.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Remaining Budget
            </p>

            <p
              className={`mt-2 text-2xl font-semibold ${
                remainingBudget < 0
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              Rs. {remainingBudget.toFixed(2)}
            </p>
          </div>
        </div>

        <DashboardClient
          expenses={expenses.map((expense) => ({
            ...expense,
            date: expense.date.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}