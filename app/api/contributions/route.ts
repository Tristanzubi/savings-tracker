import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

// Validation schema for creating a contribution
const createContributionSchema = z.object({
  savingsAccountId: z.string().min(1, "Savings account ID is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().datetime().or(z.date()),
  notes: z.string().max(500).optional(),
});

/**
 * GET /api/contributions
 * Fetch all contributions for the authenticated user (with account names)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const limit = searchParams.get("limit");

    // Build the where clause
    const whereClause: any = {
      savingsAccount: {
        userId: user.id,
      },
    };

    if (accountId) {
      whereClause.savingsAccountId = accountId;
    }

    const contributions = await prisma.savingsContribution.findMany({
      where: whereClause,
      include: {
        savingsAccount: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(contributions);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contributions
 * Create a new contribution and update the account's currentBalance
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validationResult = createContributionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { savingsAccountId, amount, date, notes } = validationResult.data;

    // Check if account exists and verify ownership
    const account = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Savings account not found" },
        { status: 404 }
      );
    }

    if (account.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Use a transaction to create contribution and update balance atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create the contribution
      const contribution = await tx.savingsContribution.create({
        data: {
          savingsAccountId,
          amount,
          date: typeof date === "string" ? new Date(date) : date,
          notes,
        },
        include: {
          savingsAccount: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });

      // Update the account's current balance
      await tx.savingsAccount.update({
        where: { id: savingsAccountId },
        data: {
          currentBalance: {
            increment: amount,
          },
        },
      });

      return contribution;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error creating contribution:", error);
    return NextResponse.json(
      { error: "Failed to create contribution" },
      { status: 500 }
    );
  }
}
