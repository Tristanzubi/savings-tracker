import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  emoji: z.string().max(10).optional(),
  targetAmount: z.number().positive("Target amount must be positive"),
  targetDate: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
});

/**
 * GET /api/projects
 * Fetch all projects for the authenticated user with calculated fields
 */
export async function GET() {
  try {
    const user = await requireAuth();

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      include: {
        allocations: {
          include: {
            savingsAccount: {
              select: {
                id: true,
                name: true,
                currentBalance: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add calculated fields
    const projectsWithDetails = projects.map((project) => {
      const currentAmount = project.allocations.reduce(
        (sum, alloc) => sum + alloc.allocatedAmount,
        0
      );
      const progress =
        project.targetAmount > 0
          ? Math.round((currentAmount / project.targetAmount) * 100)
          : 0;

      return {
        ...project,
        currentAmount,
        progress,
        allocatedFromAccounts: project.allocations.map((alloc) => ({
          accountId: alloc.savingsAccount.id,
          accountName: alloc.savingsAccount.name,
          amount: alloc.allocatedAmount,
        })),
        allocations: project.allocations.map((alloc) => ({
          id: alloc.id,
          allocatedAmount: alloc.allocatedAmount,
          savingsAccount: alloc.savingsAccount,
        })),
      };
    });

    return NextResponse.json(projectsWithDetails);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validationResult = createProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, description, emoji, targetAmount, targetDate, status } =
      validationResult.data;

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        description,
        emoji,
        targetAmount,
        targetDate: targetDate ? new Date(targetDate) : null,
        status: status || ProjectStatus.ACTIVE,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
