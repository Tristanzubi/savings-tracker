import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const updateAllocationSchema = z.object({
  allocatedAmount: z.number().min(0, "Allocated amount must be non-negative"),
});

/**
 * PATCH /api/projects/[id]/allocations/[allocationId]
 * Update an allocation amount
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; allocationId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: projectId, allocationId } = await params;
    const body = await request.json();

    // Verify ownership through project
    const allocation = await prisma.projectAllocation.findUnique({
      where: { id: allocationId },
      include: {
        project: true,
        savingsAccount: {
          include: {
            allocations: {
              where: {
                id: { not: allocationId }, // Other allocations
              },
            },
          },
        },
      },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: "Allocation not found" },
        { status: 404 }
      );
    }

    if (allocation.project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (allocation.projectId !== projectId) {
      return NextResponse.json(
        { error: "Allocation does not belong to this project" },
        { status: 400 }
      );
    }

    // Validate request body
    const validationResult = updateAllocationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { allocatedAmount } = validationResult.data;

    // Calculate available balance (excluding current allocation)
    const otherAllocations = allocation.savingsAccount.allocations.reduce(
      (sum, alloc) => sum + alloc.allocatedAmount,
      0
    );
    const availableBalance =
      allocation.savingsAccount.currentBalance - otherAllocations;

    if (allocatedAmount > availableBalance) {
      return NextResponse.json(
        {
          error: "Insufficient available balance in account",
          details: {
            accountBalance: allocation.savingsAccount.currentBalance,
            otherAllocations,
            availableBalance,
            requestedAmount: allocatedAmount,
          },
        },
        { status: 400 }
      );
    }

    const updatedAllocation = await prisma.projectAllocation.update({
      where: { id: allocationId },
      data: { allocatedAmount },
      include: {
        savingsAccount: {
          select: {
            id: true,
            name: true,
            currentBalance: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAllocation);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error updating allocation:", error);
    return NextResponse.json(
      { error: "Failed to update allocation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]/allocations/[allocationId]
 * Delete an allocation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; allocationId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: projectId, allocationId } = await params;

    // Verify ownership through project
    const allocation = await prisma.projectAllocation.findUnique({
      where: { id: allocationId },
      include: {
        project: true,
      },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: "Allocation not found" },
        { status: 404 }
      );
    }

    if (allocation.project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (allocation.projectId !== projectId) {
      return NextResponse.json(
        { error: "Allocation does not belong to this project" },
        { status: 400 }
      );
    }

    await prisma.projectAllocation.delete({
      where: { id: allocationId },
    });

    return NextResponse.json({ message: "Allocation deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error deleting allocation:", error);
    return NextResponse.json(
      { error: "Failed to delete allocation" },
      { status: 500 }
    );
  }
}
