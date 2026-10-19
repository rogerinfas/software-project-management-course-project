# Descripción del Proyecto — IEP Madre Santa Beatriz

Plataforma web de gestión administrativa para la Institución Educativa
**Madre Santa Beatriz (Arequipa)**. Proyecto académico del curso de
Software Project Management: digitaliza el ciclo completo del colegio,
desde la captación del postulante hasta la cobranza.

## Qué hace

- **Landing pública** (`/`): hero institucional, stats, comunicados y
  formulario de admisión que crea prospectos en el CRM.
- **M1 · Admisión**: pipeline Kanban (Entrevista → Eval. Psicológica →
  Eval. Académica) con drag & drop, agenda de citas, documentos y
  dictamen final (Apto / No Apto).
- **M2 · Matrícula**: apoderados, expediente familiar, formalización con
  validación de vacantes, asignación de sección y ficha de matrícula.
- **M3 · Académica**: malla curricular, horarios, carga docente,
  secciones (aforo/apertura-cierre) y panel de comunicados.
- **M4 · Tesorería**: tarifario, cargos, cobranzas en ventanilla con
  estados (Pendiente/Parcial/Pagado/Vencido) y comprobantes.

## Stack

| Capa | Tecno |
|------|-------|
| API | NestJS 11 + CQRS + Prisma 7 + PostgreSQL 16 + Better Auth (cookies) + Scalar/Swagger |
| Admin web | Next.js 16 + React 19 + Tailwind 4 + Base UI + TanStack Query + openapi-fetch |
| Datos | PostgreSQL en Docker (`localhost:4900`), Prisma Studio en `:5555` |

## Puertos locales

API `:5000` (`/api/docs`), Admin `:2000` (`/login`), DB `:4900`.

## Roles y accesos

`ADMIN`, `TEACHER`, `STAFF`, `ADMISSION`, `TREASURY` — creados
automáticamente al arrancar el backend (ver `backend/README.md`).
Login de prueba: `admin@santabeatriz.com` / `Admin123!`.

## Arranque rápido

```bash
cd backend && docker compose up -d && pnpm install \
  && pnpm exec prisma migrate deploy && pnpm start:dev
cd frontend && pnpm install && pnpm dev
```

Ver `screenshots/` para el tour visual del sistema.
