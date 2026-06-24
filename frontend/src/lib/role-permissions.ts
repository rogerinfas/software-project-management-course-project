/**
 * Fuente de verdad única para los permisos de ruta por rol.
 * Referencia: backend/roles.md
 *
 * Usada en dos lugares:
 *  1. app-sidebar.tsx  → filtra qué grupos se muestran
 *  2. (dashboard)/layout.tsx → redirige si el usuario accede a una ruta no permitida
 */

export type Role = "ADMIN" | "ADMISSION" | "TREASURY" | "TEACHER" | "STAFF";

/** Todos los roles del sistema — útil como lista blanca para grupos públicos del sidebar */
export const ALL_ROLES: Role[] = ["ADMIN", "ADMISSION", "TREASURY", "TEACHER", "STAFF"];

/**
 * Prefijos de ruta protegidos y los roles que pueden acceder a ellos.
 * ADMIN siempre tiene acceso a todo — se incluye explícitamente para claridad.
 */
export const ROUTE_PERMISSIONS: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admission", roles: ["ADMIN", "ADMISSION"] },
  { prefix: "/enrollment", roles: ["ADMIN", "ADMISSION", "STAFF"] },
  { prefix: "/academic",   roles: ["ADMIN", "TEACHER"] },
  { prefix: "/treasury",   roles: ["ADMIN", "TREASURY"] },
];

/**
 * Devuelve true si el rol tiene permiso para acceder a la ruta.
 * Las rutas que no coinciden con ningún prefijo protegido son accesibles para
 * cualquier usuario autenticado (ej: "/", "/dashboard").
 */
export function isRouteAllowed(pathname: string, role: Role): boolean {
  const match = ROUTE_PERMISSIONS.find((r) =>
    pathname.startsWith(r.prefix)
  );

  // Ruta no restringida (dashboard raíz, landing, etc.) → permitida para todos
  if (!match) return true;

  return match.roles.includes(role);
}
