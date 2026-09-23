import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
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

    const totalExpenses = await prisma.expense.aggregate({
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    });

    const currentMonthExpenses = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

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

    const totalExpenseAmount = totalExpenses._sum.amount ?? 0;
    const currentMonthSpending =
      currentMonthExpenses._sum.amount ?? 0;
    const totalBudget = currentMonthBudgets._sum.monthlyLimit ?? 0;

    const remainingBudget = totalBudget - currentMonthSpending;

    return NextResponse.json({
      totalExpenses: totalExpenseAmount,
      currentMonthSpending,
      totalBudget,
      remainingBudget,
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}