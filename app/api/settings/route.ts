import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

// Validation schema for updating user settings
const updateSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  // Note: Add goalAmount and targetDate when they're added to the User schema
  // goalAmount: z.number().min(0).optional(),
  // targetDate: z.string().datetime().or(z.date()).optional(),
});

/**
 * GET /api/settings
 * Fetch user settings (goal amount, target date, user profile)
 */
export async function GET() {
  try {
    const user = await requireAuth();

    const userSettings = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Note: Add these fields when they're added to the User schema
        // goalAmount: true,
        // targetDate: true,
      },
    });

    if (!userSettings) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // For now, return placeholder values for goal settings
    // These should be added to the User schema in the future
    return NextResponse.json({
      ...userSettings,
      goalAmount: 0, // TODO: Add to User schema
      targetDate: null, // TODO: Add to User schema
    });
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

    // Only update fields that are provided
    if (validationResult.data.name !== undefined) {
      updateData.name = validationResult.data.name;
    }

    if (validationResult.data.email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email: validationResult.data.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      updateData.email = validationResult.data.email;
    }

    // Note: Add goalAmount and targetDate updates when they're added to the User schema
    // if (validationResult.data.goalAmount !== undefined) {
    //   updateData.goalAmount = validationResult.data.goalAmount;
    // }
    // if (validationResult.data.targetDate !== undefined) {
    //   updateData.targetDate = typeof validationResult.data.targetDate === 'string'
    //     ? new Date(validationResult.data.targetDate)
    //     : validationResult.data.targetDate;
    // }

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...updatedUser,
      goalAmount: 0, // TODO: Add to User schema
      targetDate: null, // TODO: Add to User schema
    });
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
