import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * DELETE /api/contributions/[id]
 * Delete a contribution (verify ownership via account, update currentBalance)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Fetch the contribution with its account to verify ownership
    const contribution = await prisma.savingsContribution.findUnique({
      where: { id },
      include: {
        savingsAccount: true,
      },
    });

    if (!contribution) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 }
      );
    }

    // Verify ownership through the savings account
    if (contribution.savingsAccount.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Use a transaction to delete contribution and update balance atomically
    await prisma.$transaction(async (tx) => {
      // Delete the contribution
      await tx.savingsContribution.delete({
        where: { id },
      });

      // Update the account's current balance (subtract the contribution amount)
      await tx.savingsAccount.update({
        where: { id: contribution.savingsAccountId },
        data: {
          currentBalance: {
            decrement: contribution.amount,
          },
        },
      });
    });

    return NextResponse.json(
      { message: "Contribution deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error deleting contribution:", error);
    return NextResponse.json(
      { error: "Failed to delete contribution" },
      { status: 500 }
    );
  }
}
