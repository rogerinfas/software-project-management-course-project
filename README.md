# software-project-management-course-project

Proyecto académico de gestión de software. Documentación en la raíz (`alcance.md`); el código vive en carpetas **independientes** (no es monorepo pnpm):

| Carpeta       | Rol |
|---------------|-----|
| `backend/`    | API NestJS — `pnpm install`, `pnpm start:dev`, `pnpm lint`, `pnpm test`, `pnpm build` |
| `prototype/`  | UI Next.js (prototipo) — `pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm build` |
| `frontend/`   | Reservado para el frontend definitivo (stub por ahora). |

## Git hooks (Husky)

- En la **raíz** solo hace falta `pnpm install` para instalar `husky` y enlazar `.husky/`.
- Los hooks delegan según archivos tocados:
  - `pre-commit`: ESLint sobre archivos staged en `backend/` o `prototype/`.
  - `pre-push`: `lint` + `test` + `build` solo en el paquete que tenga cambios respecto a `origin/main` (fallback: último commit).
  - `commit-msg`: Conventional Commits vía `commitlint` usando las dependencias de `backend/` o `prototype/` (quien tenga `node_modules`).

Para mensajes de commit estrictos, ejecuta al menos una vez `pnpm install` dentro de `backend/` o `prototype/`.

## Documentación de contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md).
