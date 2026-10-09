import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    <main className="eq-main">
      <div className="eq-content">
        <div className="eq-page-heading">
          <div>
            <h1 className="eq-page-title">Overview</h1>
            <p className="eq-page-description">
              Welcome back, <span className="font-medium text-gray-900">{session.user.name || session.user.email}</span>. Here is your financial summary.
            </p>
          </div>
        </div>

        <div className="eq-summary-grid">
          <section className="eq-summary-primary" aria-label="Monthly spending summary">
            <div className="eq-summary-item">
              <p className="eq-summary-label">This month spending</p>
              <p className="eq-summary-value">Rs. {currentMonthSpending.toFixed(2)}</p>
            </div>
            <div className="eq-summary-subgrid">
              <div className="eq-summary-item">
                <p className="eq-summary-label">Total budget</p>
                <p className="eq-summary-subvalue">Rs. {totalBudget.toFixed(2)}</p>
              </div>
              <div className="eq-summary-item">
                <p className="eq-summary-label">Remaining budget</p>
                <p className={`eq-summary-subvalue ${remainingBudget < 0 ? "is-over-budget" : "is-positive"}`}>
                  Rs. {remainingBudget.toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          <div className="eq-summary-secondary">
            <div>
              <p className="eq-summary-label">All-time expenses</p>
              <p className="eq-summary-value">Rs. {totalExpenses.toFixed(2)}</p>
            </div>
            <p className="eq-summary-description">Total recorded spending across all months and categories.</p>
          </div>
        </div>

        <DashboardClient
          expenses={expenses.map((expense) => ({
            ...expense,
            date: new Date(expense.date).toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
