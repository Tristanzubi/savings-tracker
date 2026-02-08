import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";
import { AccountType } from "@prisma/client";

// Validation schema for creating a savings account
const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.nativeEnum(AccountType),
  interestRate: z.number().min(0).max(100),
  initialBalance: z.number().min(0),
});

/**
 * GET /api/accounts
 * Fetch all savings accounts for the authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth();

    const accounts = await prisma.savingsAccount.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            contributions: true,
          },
        },
        allocations: {
          select: {
            id: true,
            allocatedAmount: true,
            projectId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/accounts
 * Create a new savings account for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validationResult = createAccountSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, type, interestRate, initialBalance } = validationResult.data;

    // Create the account with currentBalance set to initialBalance
    const account = await prisma.savingsAccount.create({
      data: {
        userId: user.id,
        name,
        type,
        interestRate,
        initialBalance,
        currentBalance: initialBalance,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
