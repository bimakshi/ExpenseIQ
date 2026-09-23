import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const { amount, categoryId, date, note } = body;

    if (!amount || !categoryId || !date) {
      return NextResponse.json(
        { message: "Amount, category, and date are required." },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        categoryId,
        date: new Date(date),
        note: note || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Expense created successfully.",
        expense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create expense error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);

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
        { message: "Expense ID is required." },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found." },
        { status: 404 }
      );
    }

    await prisma.expense.delete({
      where: {
        id: expense.id,
      },
    });

    return NextResponse.json({
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    console.error("Delete expense error:", error);

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

    const { id, amount, categoryId, date, note } = body;

    if (!id || !amount || !categoryId || !date) {
      return NextResponse.json(
        { message: "Expense ID, amount, category, and date are required." },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found." },
        { status: 404 }
      );
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id: expense.id,
      },
      data: {
        amount: Number(amount),
        categoryId,
        date: new Date(date),
        note: note || null,
      },
    });

    return NextResponse.json({
      message: "Expense updated successfully.",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}