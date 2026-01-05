import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * GET /api/stats
 * Calculate and return dashboard statistics for the authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth();

    // Get current date for month calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Fetch all user's accounts
    const accounts = await prisma.savingsAccount.findMany({
      where: {
        userId: user.id,
      },
      select: {
        currentBalance: true,
      },
    });

    // Calculate total current savings (sum of all account balances)
    const totalSavings = accounts.reduce(
      (sum, account) => sum + account.currentBalance,
      0
    );

    // Fetch all contributions for the user
    const allContributions = await prisma.savingsContribution.findMany({
      where: {
        savingsAccount: {
          userId: user.id,
        },
      },
      select: {
        amount: true,
        date: true,
        savingsAccount: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate contributions this month
    const contributionsThisMonth = allContributions.filter(
      (c) => c.date >= startOfMonth && c.date < startOfNextMonth
    );
    const totalContributionsThisMonth = contributionsThisMonth.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    // Calculate total contributions since beginning
    const totalContributions = allContributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    // Calculate average monthly contributions
    let averageMonthlyContributions = 0;
    if (allContributions.length > 0) {
      // Get the date of the first contribution
      const firstContributionDate = new Date(
        Math.min(...allContributions.map((c) => c.date.getTime()))
      );

      // Calculate the number of months since the first contribution
      const monthsSinceFirstContribution =
        (now.getFullYear() - firstContributionDate.getFullYear()) * 12 +
        (now.getMonth() - firstContributionDate.getMonth()) +
        1; // +1 to include the current month

      averageMonthlyContributions =
        totalContributions / Math.max(monthsSinceFirstContribution, 1);
    }

    // Get user settings for goal
    const userSettings = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Note: Since the User model doesn't have goal fields in the schema,
    // we'll need to add them later or use a default value
    // For now, we'll use placeholder values
    const goalAmount = 0; // TODO: Add to User schema
    const targetDate = null; // TODO: Add to User schema

    // Calculate progress toward goal
    const progressPercentage =
      goalAmount > 0 ? (totalSavings / goalAmount) * 100 : 0;

    // Get recent contributions (last 5)
    const recentContributions = allContributions.slice(0, 5);

    // Calculate contribution trend (compare this month to last month)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const contributionsLastMonth = allContributions.filter(
      (c) => c.date >= startOfLastMonth && c.date < startOfMonth
    );
    const totalContributionsLastMonth = contributionsLastMonth.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    const monthlyTrend =
      totalContributionsLastMonth > 0
        ? ((totalContributionsThisMonth - totalContributionsLastMonth) /
            totalContributionsLastMonth) *
          100
        : totalContributionsThisMonth > 0
        ? 100
        : 0;

    // Return statistics
    return NextResponse.json({
      totalSavings,
      totalContributionsThisMonth,
      averageMonthlyContributions,
      totalContributions,
      goalAmount,
      targetDate,
      progressPercentage: Math.min(progressPercentage, 100), // Cap at 100%
      monthlyTrend,
      recentContributions,
      accountCount: accounts.length,
      contributionCount: allContributions.length,
      user: userSettings,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
