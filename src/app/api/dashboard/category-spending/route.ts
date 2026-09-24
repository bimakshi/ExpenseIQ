import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const now = new Date();

    const selectedMonth = monthParam
      ? Number(monthParam)
      : now.getMonth() + 1;

    const selectedYear = yearParam
      ? Number(yearParam)
      : now.getFullYear();

    if (
      selectedMonth < 1 ||
      selectedMonth > 12 ||
      selectedYear < 2000
    ) {
      return NextResponse.json(
        { message: "Invalid month or year." },
        { status: 400 }
      );
    }

    const startOfMonth = new Date(
      selectedYear,
      selectedMonth - 1,
      1
    );

    const startOfNextMonth = new Date(
      selectedYear,
      selectedMonth,
      1
    );

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      include: {
        category: true,
      },
    });

    const categoryTotals = new Map<string, number>();

    for (const expense of expenses) {
      const categoryName = expense.category.name;

      const currentTotal =
        categoryTotals.get(categoryName) ?? 0;

      categoryTotals.set(
        categoryName,
        currentTotal + expense.amount
      );
    }

    const spendingByCategory = Array.from(
      categoryTotals.entries()
    ).map(([category, amount]) => ({
      category,
      amount,
    }));

    return NextResponse.json(spendingByCategory);
  } catch (error) {
    console.error(
      "Get category spending error:",
      error
    );

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}