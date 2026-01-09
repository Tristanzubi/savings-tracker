import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

// Validation schema for updating user settings
const updateSettingsSchema = z.object({
  goal: z.number().min(0).optional(),
  targetDate: z.string().optional(),
});

/**
 * GET /api/settings
 * Fetch user settings (goal amount, target date, user profile)
 */
export async function GET() {
  try {
    const user = await requireAuth();

    const userSettings = await prisma.userSettings.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        goal: true,
        targetDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return default settings if none exist
    if (!userSettings) {
      return NextResponse.json({
        id: null,
        goal: 40000,
        targetDate: new Date("2028-12-31"),
        createdAt: null,
        updatedAt: null,
      });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/settings
 * Update user settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validationResult = updateSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (validationResult.data.goal !== undefined) {
      updateData.goal = validationResult.data.goal;
    }

    if (validationResult.data.targetDate !== undefined) {
      updateData.targetDate = new Date(validationResult.data.targetDate);
    }

    // Try to update existing settings, or create if they don't exist
    let settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (settings) {
      // Update existing settings
      const updatedSettings = await prisma.userSettings.update({
        where: { userId: user.id },
        data: updateData,
        select: {
          id: true,
          goal: true,
          targetDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(updatedSettings);
    } else {
      // Create new settings
      const newSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          ...updateData,
        },
        select: {
          id: true,
          goal: true,
          targetDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(newSettings, { status: 201 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
