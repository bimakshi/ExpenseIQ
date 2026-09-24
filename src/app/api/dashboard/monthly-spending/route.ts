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

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    );

    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyTotals = new Map<string, number>();

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - i),
        1
      );

      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;

      monthlyTotals.set(key, 0);
    }

    for (const expense of expenses) {
      const expenseDate = new Date(expense.date);

      const key = `${expenseDate.getFullYear()}-${expenseDate.getMonth()}`;

      const currentTotal =
        monthlyTotals.get(key) ?? 0;

      monthlyTotals.set(
        key,
        currentTotal + expense.amount
      );
    }

    const monthlySpending = Array.from(
      monthlyTotals.entries()
    ).map(([key, amount]) => {
      const [year, month] = key.split("-").map(Number);

      return {
        month: monthNames[month],
        year,
        amount,
      };
    });

    return NextResponse.json(monthlySpending);
  } catch (error) {
    console.error(
      "Get monthly spending error:",
      error
    );

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}