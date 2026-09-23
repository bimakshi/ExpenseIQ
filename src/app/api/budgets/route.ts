import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
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

    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.findMany({
          where: {
            userId: session.user.id,
            categoryId: budget.categoryId,
            date: {
              gte: new Date(budget.year, budget.month - 1, 1),
              lt: new Date(budget.year, budget.month, 1),
            },
          },
          select: {
            amount: true,
          },
        });

        const spent = expenses.reduce(
          (total, expense) => total + expense.amount,
          0
        );

        const percentage = (spent / budget.monthlyLimit) * 100;

        return {
          ...budget,
          spent,
          percentage,
        };
      })
    );

    return NextResponse.json(budgetsWithSpending);
  } catch (error) {
    console.error("Get budgets error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { monthlyLimit, month, year, categoryId } = body;

    if (!monthlyLimit || !month || !year || !categoryId) {
      return NextResponse.json(
        {
          message:
            "Monthly limit, month, year, and category are required.",
        },
        { status: 400 }
      );
    }

    const limit = Number(monthlyLimit);
    const selectedMonth = Number(month);
    const selectedYear = Number(year);

    if (limit <= 0) {
      return NextResponse.json(
        { message: "Monthly limit must be greater than zero." },
        { status: 400 }
      );
    }

    if (selectedMonth < 1 || selectedMonth > 12) {
      return NextResponse.json(
        { message: "Month must be between 1 and 12." },
        { status: 400 }
      );
    }

    if (selectedYear < 2000) {
      return NextResponse.json(
        { message: "Invalid year." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_categoryId_month_year: {
          userId: session.user.id,
          categoryId,
          month: selectedMonth,
          year: selectedYear,
        },
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { message: "A budget already exists for this category and month." },
        { status: 409 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        monthlyLimit: limit,
        month: selectedMonth,
        year: selectedYear,
        categoryId,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        message: "Budget created successfully.",
        budget,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create budget error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { id, monthlyLimit, month, year, categoryId } = body;

    if (!id || !monthlyLimit || !month || !year || !categoryId) {
      return NextResponse.json(
        {
          message:
            "Budget ID, monthly limit, month, year, and category are required.",
        },
        { status: 400 }
      );
    }

    const limit = Number(monthlyLimit);
    const selectedMonth = Number(month);
    const selectedYear = Number(year);

    if (limit <= 0) {
      return NextResponse.json(
        { message: "Monthly limit must be greater than zero." },
        { status: 400 }
      );
    }

    if (selectedMonth < 1 || selectedMonth > 12) {
      return NextResponse.json(
        { message: "Month must be between 1 and 12." },
        { status: 400 }
      );
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingBudget) {
      return NextResponse.json(
        { message: "Budget not found." },
        { status: 404 }
      );
    }

    const duplicateBudget = await prisma.budget.findFirst({
      where: {
        userId: session.user.id,
        categoryId,
        month: selectedMonth,
        year: selectedYear,
        NOT: {
          id,
        },
      },
    });

    if (duplicateBudget) {
      return NextResponse.json(
        { message: "A budget already exists for this category and month." },
        { status: 409 }
      );
    }

    const updatedBudget = await prisma.budget.update({
      where: {
        id,
      },
      data: {
        monthlyLimit: limit,
        month: selectedMonth,
        year: selectedYear,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      message: "Budget updated successfully.",
      budget: updatedBudget,
    });
  } catch (error) {
    console.error("Update budget error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Budget ID is required." },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!budget) {
      return NextResponse.json(
        { message: "Budget not found." },
        { status: 404 }
      );
    }

    await prisma.budget.delete({
      where: {
        id: budget.id,
      },
    });

    return NextResponse.json({
      message: "Budget deleted successfully.",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}