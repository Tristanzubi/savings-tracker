import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Réactiver l'authentification plus tard
export function middleware(_request: NextRequest) {
  // Middleware désactivé temporairement pour le développement
  return NextResponse.next();

  /*
  const { pathname } = request.nextUrl;

  // Routes publiques (ne nécessitant pas d'authentification)
  const publicRoutes = ["/test", "/auth"];

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si c'est une route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Pour toutes les autres routes, vérifier l'authentification
  const sessionToken = request.cookies.get("better-auth.session_token");

  if (!sessionToken) {
    // Rediriger vers la page de login si pas de session
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - api (routes API)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
