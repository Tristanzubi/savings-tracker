# Recommended Schema Updates

To fully support the settings and statistics features, you should add goal-related fields to the User model.

## 1. Update Prisma Schema

Edit `/Users/tristanzubiarrain/WestDevs/savings-tracker/prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Add these new fields:
  goalAmount  Float?    @default(0) // User's savings goal amount
  targetDate  DateTime? // Target date to reach the goal

  savingsAccounts SavingsAccount[]

  @@map("users")
}
```

## 2. Create Migration

Run the following command to create a migration:

```bash
npx prisma migrate dev --name add_user_goal_fields
```

This will:
- Create a new migration file in `prisma/migrations/`
- Update your database schema
- Regenerate the Prisma Client

## 3. Update API Routes

After adding these fields to the schema, update the following files:

### /app/api/stats/route.ts

Replace the placeholder lines (around line 68-69):

```typescript
// Before:
const goalAmount = 0; // TODO: Add to User schema
const targetDate = null; // TODO: Add to User schema

// After:
const goalAmount = userSettings?.goalAmount || 0;
const targetDate = userSettings?.targetDate || null;
```

Update the query to include these fields (around line 59):

```typescript
const userSettings = await prisma.user.findUnique({
  where: {
    id: user.id,
  },
  select: {
    id: true,
    email: true,
    name: true,
    goalAmount: true,    // Add this
    targetDate: true,    // Add this
  },
});
```

And update the return statement (around line 106):

```typescript
return NextResponse.json({
  totalSavings,
  totalContributionsThisMonth,
  averageMonthlyContributions,
  totalContributions,
  goalAmount,           // Already using the variable
  targetDate,           // Already using the variable
  progressPercentage: Math.min(progressPercentage, 100),
  monthlyTrend,
  recentContributions,
  accountCount: accounts.length,
  contributionCount: allContributions.length,
  user: userSettings,
});
```

### /app/api/settings/route.ts

1. Update the validation schema (around line 6):

```typescript
const updateSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  goalAmount: z.number().min(0).optional(),           // Uncomment this
  targetDate: z.string().datetime().or(z.date()).optional(), // Uncomment this
});
```

2. Update the GET endpoint to include real values (around line 23):

```typescript
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
    goalAmount: true,    // Uncomment this
    targetDate: true,    // Uncomment this
  },
});

if (!userSettings) {
  return NextResponse.json(
    { error: "User not found" },
    { status: 404 }
  );
}

// Remove the placeholder values and return userSettings directly:
return NextResponse.json(userSettings);
```

3. Update the PATCH endpoint to support updating these fields (around line 83):

```typescript
// Uncomment these sections:
if (validationResult.data.goalAmount !== undefined) {
  updateData.goalAmount = validationResult.data.goalAmount;
}

if (validationResult.data.targetDate !== undefined) {
  updateData.targetDate = typeof validationResult.data.targetDate === 'string'
    ? new Date(validationResult.data.targetDate)
    : validationResult.data.targetDate;
}
```

4. Update the return statement at the end of PATCH (around line 106):

```typescript
const updatedUser = await prisma.user.update({
  where: { id: user.id },
  data: updateData,
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    goalAmount: true,    // Add this
    targetDate: true,    // Add this
  },
});

// Return the updated user directly (remove placeholder values):
return NextResponse.json(updatedUser);
```

## 4. Verification

After making these changes:

1. Verify the migration worked:
```bash
npx prisma studio
```

2. Test the API endpoints:
```bash
# Test GET settings
curl http://localhost:3000/api/settings

# Test PATCH settings
curl -X PATCH http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"goalAmount": 10000, "targetDate": "2025-12-31T00:00:00.000Z"}'

# Test stats endpoint
curl http://localhost:3000/api/stats
```

## 5. Optional: Seed Data

Update your seed script to include default goal values:

```typescript
// prisma/seed.ts
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password_here',
    goalAmount: 10000,
    targetDate: new Date('2025-12-31'),
  },
});
```

## Benefits

After completing these updates, your application will have:

- Full support for user savings goals
- Accurate progress tracking
- Target date functionality
- Complete settings management
- No placeholder values in API responses

## Rollback

If you need to rollback the migration:

```bash
npx prisma migrate reset
```

Note: This will delete all data in your database. Only use in development!
