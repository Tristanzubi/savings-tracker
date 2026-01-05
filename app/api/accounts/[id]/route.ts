import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";
import { AccountType } from "@prisma/client";

// Validation schema for updating a savings account
const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.nativeEnum(AccountType).optional(),
  interestRate: z.number().min(0).max(100).optional(),
});

/**
 * GET /api/accounts/[id]
 * Fetch a specific savings account (verify ownership)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const account = await prisma.savingsAccount.findUnique({
      where: {
        id,
      },
      include: {
        contributions: {
          orderBy: {
            date: "desc",
          },
        },
        _count: {
          select: {
            contributions: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (account.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/accounts/[id]
 * Update a specific savings account (verify ownership)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = updateAccountSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Check if account exists and verify ownership
    const existingAccount = await prisma.savingsAccount.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    if (existingAccount.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update the account
    const updatedAccount = await prisma.savingsAccount.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/accounts/[id]
 * Delete a specific savings account (verify ownership, cascade delete contributions)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Check if account exists and verify ownership
    const existingAccount = await prisma.savingsAccount.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    if (existingAccount.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete the account (contributions will be cascade deleted due to schema)
    await prisma.savingsAccount.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
