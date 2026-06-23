import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  // Las rutas que no necesitan protección (landing, login, api)
  const publicPaths = ["/login", "/landing", "/api/"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  ) || request.nextUrl.pathname === "/";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verificamos si existe la cookie de better-auth.
  // Su nombre por defecto es `better-auth.session_token`
  const sessionCookieName = "better-auth.session_token";
  const sessionToken = request.cookies.get(sessionCookieName)?.value;

  if (!sessionToken) {
    // Si no hay cookie, redirigimos al login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Opcionalmente, se podría validar el token contra el backend aquí,
  // pero solo comprobar la existencia de la cookie ya mitiga el flash de UI
  // y la validación final se hace en el layout.tsx en el cliente o SSR.

  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
