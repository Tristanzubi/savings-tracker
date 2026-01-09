import { PrismaClient, AccountType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed de la base de données...");

  // Nettoyer la base de données
  await prisma.savingsContribution.deleteMany();
  await prisma.savingsAccount.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Base de données nettoyée");

  // Créer les utilisateurs (Better Auth gère la création)
  const tristan = await prisma.user.create({
    data: {
      email: "tristan@example.com",
      name: "Tristan",
      emailVerified: true,
    },
  });

  const copine = await prisma.user.create({
    data: {
      email: "copine@example.com",
      name: "Copine",
      emailVerified: true,
    },
  });

  console.log("✅ 2 utilisateurs créés");

  // Comptes d'épargne de Tristan
  const tristanLEP = await prisma.savingsAccount.create({
    data: {
      userId: tristan.id,
      name: "LEP Tristan",
      type: AccountType.LEP,
      interestRate: 5.0,
      initialBalance: 5000,
      currentBalance: 7500,
    },
  });

  const tristanPEL = await prisma.savingsAccount.create({
    data: {
      userId: tristan.id,
      name: "PEL Tristan",
      type: AccountType.PEL,
      interestRate: 2.25,
      initialBalance: 8000,
      currentBalance: 10000,
    },
  });

  const tristanLivretA = await prisma.savingsAccount.create({
    data: {
      userId: tristan.id,
      name: "Livret A Tristan",
      type: AccountType.LIVRET_A,
      interestRate: 3.0,
      initialBalance: 2000,
      currentBalance: 3200,
    },
  });

  // Comptes d'épargne de Copine
  const copineLEP = await prisma.savingsAccount.create({
    data: {
      userId: copine.id,
      name: "LEP Copine",
      type: AccountType.LEP,
      interestRate: 5.0,
      initialBalance: 4500,
      currentBalance: 6200,
    },
  });

  const copineLivretA = await prisma.savingsAccount.create({
    data: {
      userId: copine.id,
      name: "Livret A Copine",
      type: AccountType.LIVRET_A,
      interestRate: 3.0,
      initialBalance: 1500,
      currentBalance: 2300,
    },
  });

  const copinePEL = await prisma.savingsAccount.create({
    data: {
      userId: copine.id,
      name: "PEL Copine",
      type: AccountType.PEL,
      interestRate: 2.25,
      initialBalance: 3000,
      currentBalance: 4100,
    },
  });

  console.log("✅ 6 comptes d'épargne créés");

  // Générer des contributions sur les 6 derniers mois
  const now = new Date();
  const contributions = [];

  // Contributions pour Tristan LEP (tous les mois)
  for (let i = 0; i < 6; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    contributions.push(
      prisma.savingsContribution.create({
        data: {
          savingsAccountId: tristanLEP.id,
          amount: 350 + Math.random() * 100, // 350-450€
          date: date,
          notes: `Épargne mensuelle - ${date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
        },
      })
    );
  }

  // Contributions pour Tristan PEL (tous les 2 mois)
  for (let i = 0; i < 3; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i * 2);
    contributions.push(
      prisma.savingsContribution.create({
        data: {
          savingsAccountId: tristanPEL.id,
          amount: 500 + Math.random() * 200, // 500-700€
          date: date,
          notes: `Épargne bimestrielle PEL`,
        },
      })
    );
  }

  // Contributions pour Tristan Livret A (irrégulier)
  for (let i = 0; i < 4; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    contributions.push(
      prisma.savingsContribution.create({
        data: {
          savingsAccountId: tristanLivretA.id,
          amount: 200 + Math.random() * 150, // 200-350€
          date: date,
          notes: `Épargne ponctuelle`,
        },
      })
    );
  }

  // Contributions pour Copine LEP
  for (let i = 0; i < 5; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    contributions.push(
      prisma.savingsContribution.create({
        data: {
          savingsAccountId: copineLEP.id,
          amount: 300 + Math.random() * 100, // 300-400€
          date: date,
          notes: `Épargne mensuelle LEP`,
        },
      })
    );
  }

  // Contributions pour Copine Livret A
  for (let i = 0; i < 4; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - Math.floor(i * 1.5));
    contributions.push(
      prisma.savingsContribution.create({
        data: {
          savingsAccountId: copineLivretA.id,
          amount: 150 + Math.random() * 100, // 150-250€
          date: date,
          notes: `Épargne Livret A`,
        },
      })
    );
  }

  await Promise.all(contributions);
  console.log(`✅ ${contributions.length} contributions créées`);

  console.log("\n📊 Résumé du seed:");
  console.log(`- 2 utilisateurs: ${tristan.email}, ${copine.email}`);
  console.log(`- 6 comptes d'épargne`);
  console.log(`- ${contributions.length} contributions sur 6 mois`);
  console.log(`- Solde total Tristan: ${(7500 + 10000 + 3200).toFixed(2)}€`);
  console.log(`- Solde total Copine: ${(6200 + 2300 + 4100).toFixed(2)}€`);
  console.log(`- TOTAL ÉPARGNÉ: ${(7500 + 10000 + 3200 + 6200 + 2300 + 4100).toFixed(2)}€`);
  console.log("\n✨ Seed terminé avec succès!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
