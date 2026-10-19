# Screenshots — IEP Madre Santa Beatriz

Capturas tomadas en local contra `http://localhost:2000` (frontend) y
`http://localhost:5000` (API), sesión `admin@santabeatriz.com`.
Viewport 1440×900. La `01` es página completa.

| # | Archivo | Vista | Por qué es relevante |
|---|---------|-------|----------------------|
| 01 | `01-landing-hero.png` | Landing pública `/` (hero, stats, comunicados, CTA admisión, footer) | Página institucional completa: hero "Forjando el Futuro", foto, stats 450+/25+/100%, comunicados reales, CTA y footer |
| 02 | `02-login.png` | Portal `/login` | Split marca/formulario, escudo, iconografía, modo claro/oscuro |
| 03 | `03-dashboard.png` | Panel `/dashboard` | Layout admin: sidebar por módulos M1–M4, breadcrumbs en español, toggle de tema, menú de usuario con rol |
| 04 | `04-admission-pipeline.png` | CRM `/admission/pipeline` | Kanban drag&drop con 3 etapas, contadores, tarjetas e historial de interacciones |
| 05 | `05-admission-evaluation.png` | Evaluación `/admission/evaluation` | Dictamen Apto/No Apto del proceso de admisión |
| 06 | `06-enrollment-formalization.png` | Formalización `/enrollment/formalization` | Asignación de vacante/sección y ficha de matrícula |
| 07 | `07-academic-schedules.png` | Horarios `/academic/schedules` | Bloques horarios y carga docente |
| 08 | `08-academic-sections.png` | Secciones `/academic/sections` | Apertura/cierre de secciones y aforo |
| 09 | `09-treasury-collections.png` | Cobranzas `/treasury/collections` | KPIs (por cobrar, vencidos, recaudado, eficiencia), tabla con estados Parcial/Vencido y cobro en ventanilla |
| 10 | `10-api-docs.png` | Scalar `http://localhost:5000/api/docs` | Documentación interactiva de la API (Better Auth + módulos) |

## Cómo reproducir

```bash
# DB
cd backend && docker compose up -d
# API (puerto 5000)
cd backend && pnpm install && pnpm exec prisma migrate deploy && pnpm start:dev
# Admin (puerto 2000)
cd frontend && pnpm install && pnpm dev
```

Login: `admin@santabeatriz.com` / `Admin123!` (ver `backend/README.md` para el resto de roles).
