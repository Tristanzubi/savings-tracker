import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const createAllocationSchema = z.object({
  savingsAccountId: z.string().min(1, "Savings account ID is required"),
  allocatedAmount: z.number().min(0, "Allocated amount must be non-negative"),
});

/**
 * GET /api/projects/[id]/allocations
 * Fetch all allocations for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allocations = await prisma.projectAllocation.findMany({
      where: { projectId },
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

    return NextResponse.json(allocations);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching allocations:", error);
    return NextResponse.json(
      { error: "Failed to fetch allocations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/allocations
 * Create or update an allocation (upsert based on unique constraint)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;
    const body = await request.json();

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate request body
    const validationResult = createAllocationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { savingsAccountId, allocatedAmount } = validationResult.data;

    // Verify account ownership and get existing allocations
    const account = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId },
      include: {
        allocations: {
          where: {
            projectId: { not: projectId }, // Other projects
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Savings account not found" },
        { status: 404 }
      );
    }

    if (account.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate available balance
    const otherAllocations = account.allocations.reduce(
      (sum, alloc) => sum + alloc.allocatedAmount,
      0
    );
    const availableBalance = account.currentBalance - otherAllocations;

    if (allocatedAmount > availableBalance) {
      return NextResponse.json(
        {
          error: "Insufficient available balance in account",
          details: {
            accountBalance: account.currentBalance,
            otherAllocations,
            availableBalance,
            requestedAmount: allocatedAmount,
          },
        },
        { status: 400 }
      );
    }

    // Use upsert to handle both create and update
    const allocation = await prisma.projectAllocation.upsert({
      where: {
        projectId_savingsAccountId: {
          projectId,
          savingsAccountId,
        },
      },
      update: {
        allocatedAmount,
      },
      create: {
        projectId,
        savingsAccountId,
        allocatedAmount,
      },
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

    return NextResponse.json(allocation, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error creating allocation:", error);
    return NextResponse.json(
      { error: "Failed to create allocation" },
      { status: 500 }
    );
  }
}
