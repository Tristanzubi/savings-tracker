# Documentation de l'API Savings Tracker

Ce document fournit un aperçu complet de tous les endpoints API disponibles pour l'application Savings Tracker.

## Authentification

Tous les endpoints API (sauf `/api/auth/*`) nécessitent une authentification via Better Auth. La session de l'utilisateur est automatiquement validée via le helper `requireAuth()`.

### Codes de statut HTTP
- `200` - Succès
- `201` - Créé
- `400` - Requête invalide (erreur de validation)
- `401` - Non autorisé (non authentifié)
- `403` - Interdit (l'utilisateur n'est pas propriétaire de la ressource)
- `404` - Non trouvé
- `500` - Erreur serveur interne

---

## API Comptes

### GET /api/accounts
Récupère tous les comptes d'épargne de l'utilisateur authentifié.

**Réponse :**
```json
[
  {
    "id": "clxxx...",
    "userId": "clxxx...",
    "name": "Livret A",
    "type": "LIVRET_A",
    "interestRate": 3.0,
    "initialBalance": 1000.0,
    "currentBalance": 1500.0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z",
    "_count": {
      "contributions": 5
    }
  }
]
```

### POST /api/accounts
Créer un nouveau compte d'épargne.

**Corps de la requête :**
```json
{
  "name": "Livret A",
  "type": "LIVRET_A",
  "interestRate": 3.0,
  "initialBalance": 1000.0
}
```

**Validation :**
- `name` : Requis, 1-100 caractères
- `type` : Requis, doit être l'un de : `LEP`, `PEL`, `LIVRET_A`, `AUTRE`
- `interestRate` : Requis, 0-100
- `initialBalance` : Requis, >= 0

**Réponse :** (201 Créé)
```json
{
  "id": "clxxx...",
  "userId": "clxxx...",
  "name": "Livret A",
  "type": "LIVRET_A",
  "interestRate": 3.0,
  "initialBalance": 1000.0,
  "currentBalance": 1000.0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/accounts/[id]
Récupère un compte d'épargne spécifique avec toutes ses contributions.

**Réponse :**
```json
{
  "id": "clxxx...",
  "userId": "clxxx...",
  "name": "Livret A",
  "type": "LIVRET_A",
  "interestRate": 3.0,
  "initialBalance": 1000.0,
  "currentBalance": 1500.0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z",
  "contributions": [
    {
      "id": "clxxx...",
      "savingsAccountId": "clxxx...",
      "amount": 100.0,
      "date": "2024-01-15T00:00:00.000Z",
      "notes": "Épargne mensuelle",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "_count": {
    "contributions": 5
  }
}
```

### PATCH /api/accounts/[id]
Mettre à jour un compte d'épargne spécifique.

**Corps de la requête :**
```json
{
  "name": "Nom de compte mis à jour",
  "type": "PEL",
  "interestRate": 2.5
}
```

**Validation :**
- Tous les champs sont optionnels
- `name` : 1-100 caractères
- `type` : Doit être l'un de : `LEP`, `PEL`, `LIVRET_A`, `AUTRE`
- `interestRate` : 0-100

**Réponse :**
```json
{
  "id": "clxxx...",
  "userId": "clxxx...",
  "name": "Nom de compte mis à jour",
  "type": "PEL",
  "interestRate": 2.5,
  "initialBalance": 1000.0,
  "currentBalance": 1500.0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-20T00:00:00.000Z"
}
```

### DELETE /api/accounts/[id]
Supprimer un compte d'épargne spécifique (supprime en cascade toutes les contributions).

**Réponse :**
```json
{
  "message": "Account deleted successfully"
}
```

---

## API Contributions

### GET /api/contributions
Récupère toutes les contributions de l'utilisateur authentifié avec les informations du compte.

**Paramètres de requête :**
- `accountId` (optionnel) : Filtrer par ID de compte spécifique
- `limit` (optionnel) : Limiter le nombre de résultats

**Réponse :**
```json
[
  {
    "id": "clxxx...",
    "savingsAccountId": "clxxx...",
    "amount": 100.0,
    "date": "2024-01-15T00:00:00.000Z",
    "notes": "Épargne mensuelle",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "savingsAccount": {
      "id": "clxxx...",
      "name": "Livret A",
      "type": "LIVRET_A"
    }
  }
]
```

### POST /api/contributions
Créer une nouvelle contribution et mettre à jour automatiquement le solde actuel du compte.

**Corps de la requête :**
```json
{
  "savingsAccountId": "clxxx...",
  "amount": 100.0,
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Épargne mensuelle"
}
```

**Validation :**
- `savingsAccountId` : Requis
- `amount` : Requis, doit être positif
- `date` : Requis, chaîne de date ISO 8601 ou objet Date
- `notes` : Optionnel, max 500 caractères

**Réponse :** (201 Créé)
```json
{
  "id": "clxxx...",
  "savingsAccountId": "clxxx...",
  "amount": 100.0,
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Épargne mensuelle",
  "createdAt": "2024-01-15T00:00:00.000Z",
  "savingsAccount": {
    "id": "clxxx...",
    "name": "Livret A",
    "type": "LIVRET_A"
  }
}
```

**Note :** Cet endpoint utilise une transaction Prisma pour garantir que la contribution est créée et que le solde du compte est mis à jour de manière atomique.

### DELETE /api/contributions/[id]
Supprimer une contribution et mettre à jour automatiquement le solde actuel du compte.

**Réponse :**
```json
{
  "message": "Contribution deleted successfully"
}
```

**Note :** Cet endpoint utilise une transaction Prisma pour garantir que la contribution est supprimée et que le solde du compte est mis à jour de manière atomique.

---

## API Statistiques

### GET /api/stats
Calcule et retourne des statistiques complètes pour le tableau de bord.

**Réponse :**
```json
{
  "totalSavings": 5000.0,
  "totalContributionsThisMonth": 300.0,
  "averageMonthlyContributions": 250.0,
  "totalContributions": 3000.0,
  "goalAmount": 10000.0,
  "targetDate": "2025-12-31T00:00:00.000Z",
  "progressPercentage": 50.0,
  "monthlyTrend": 20.0,
  "recentContributions": [
    {
      "id": "clxxx...",
      "savingsAccountId": "clxxx...",
      "amount": 100.0,
      "date": "2024-01-15T00:00:00.000Z",
      "notes": "Épargne mensuelle",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "savingsAccount": {
        "name": "Livret A",
        "type": "LIVRET_A"
      }
    }
  ],
  "accountCount": 3,
  "contributionCount": 12,
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Description des champs :**
- `totalSavings` : Somme de tous les soldes actuels des comptes
- `totalContributionsThisMonth` : Somme des contributions du mois calendaire en cours
- `averageMonthlyContributions` : Montant moyen des contributions mensuelles depuis la première contribution
- `totalContributions` : Somme de toutes les contributions jamais effectuées
- `goalAmount` : Objectif d'épargne de l'utilisateur (TODO: ajouter au schéma User)
- `targetDate` : Date cible de l'utilisateur pour atteindre l'objectif (TODO: ajouter au schéma User)
- `progressPercentage` : Pourcentage de progression vers l'objectif (plafonné à 100%)
- `monthlyTrend` : Variation en pourcentage du mois dernier au mois actuel
- `recentContributions` : 5 dernières contributions
- `accountCount` : Nombre total de comptes d'épargne
- `contributionCount` : Nombre total de contributions

---

## API Paramètres

### GET /api/settings
Récupère les paramètres et informations de profil de l'utilisateur.

**Réponse :**
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z",
  "goalAmount": 10000.0,
  "targetDate": "2025-12-31T00:00:00.000Z"
}
```

**Note :** `goalAmount` et `targetDate` sont actuellement des valeurs de remplacement (0 et null) et doivent être ajoutés au schéma User.

### PATCH /api/settings
Mettre à jour les paramètres utilisateur.

**Corps de la requête :**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Validation :**
- Tous les champs sont optionnels
- `name` : 1-100 caractères
- `email` : Doit être au format email valide et ne pas être déjà utilisé par un autre utilisateur

**Réponse :**
```json
{
  "id": "clxxx...",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-20T00:00:00.000Z",
  "goalAmount": 10000.0,
  "targetDate": "2025-12-31T00:00:00.000Z"
}
```

---

## Réponses d'erreur

Tous les endpoints retournent des réponses d'erreur cohérentes :

**Erreur de validation (400) :**
```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["amount"],
      "message": "Expected number, received string"
    }
  ]
}
```

**Non autorisé (401) :**
```json
{
  "error": "Unauthorized"
}
```

**Interdit (403) :**
```json
{
  "error": "Forbidden"
}
```

**Non trouvé (404) :**
```json
{
  "error": "Account not found"
}
```

**Erreur serveur (500) :**
```json
{
  "error": "Failed to fetch accounts"
}
```

---

## Améliorations futures

### Mises à jour nécessaires du schéma User
Pour prendre en charge pleinement les fonctionnalités de paramètres et de statistiques, ajouter ces champs au modèle User dans `schema.prisma` :

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Nouveaux champs à ajouter :
  goalAmount  Float?    // Montant de l'objectif d'épargne
  targetDate  DateTime? // Date cible pour atteindre l'objectif

  savingsAccounts SavingsAccount[]

  @@map("users")
}
```

Après avoir ajouté ces champs :
1. Exécuter `npx prisma migrate dev` pour créer une migration
2. Mettre à jour `/app/api/stats/route.ts` pour utiliser les valeurs réelles au lieu de placeholders
3. Mettre à jour `/app/api/settings/route.ts` pour prendre en charge la mise à jour de ces champs
4. Décommenter les champs pertinents du schéma de validation

---

## Bonnes pratiques pour l'intégration frontend

1. **Sécurité des types** : Importer les types depuis `/lib/api-types.ts` pour un support TypeScript complet

2. **Gestion des erreurs** : Toujours vérifier les réponses d'erreur et gérer 401/403 de manière appropriée

3. **Gestion des dates** : L'API retourne des chaînes de date ISO 8601 - les parser avec `new Date()`

4. **Mises à jour optimistes** : Considérer l'utilisation de mises à jour optimistes pour une meilleure UX, mais assurer un rollback approprié en cas d'erreur

5. **États de chargement** : Afficher des indicateurs de chargement pendant les appels API

6. **Validation** : Bien que l'API valide toutes les entrées, considérer la validation côté client pour une meilleure UX

7. **Transactions** : L'API utilise des transactions Prisma pour les opérations critiques (contributions), garantissant la cohérence des données

8. **Mise en cache** : Considérer l'implémentation d'un cache côté client (ex: SWR, React Query) pour les données fréquemment consultées
