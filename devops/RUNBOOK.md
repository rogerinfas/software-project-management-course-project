# CI/CD Runbook — School Management System

## Branch strategy

| Rama | Propósito | Flujos activos |
|------|-----------|---------------|
| `develop` | Integración diaria, PRs de features | CI solamente |
| `production` | Rama de producción, releases | CI (gate) + CD (deploy) |

**Reglas:**
- Todo trabajo se hace en ramas feature/fix/refactor creadas desde `develop`.
- Para pasar a producción: PR `develop → production` → CI gate verde → merge → CD despliega automáticamente.

---

## Flujo completo

```
feature/x  ──PR──▶  develop  ──(CI ok)──▶  merge
                        │
                        └──PR──▶  production  ──(CI gate + CD)──▶  VPS
```

---

## CI Workflow

**Archivo:** `.github/workflows/ci.yml`  
**Trigger:** `pull_request` hacia `develop` o `production`

### PRs hacia `develop` — jobs en orden:

**Backend:**
1. `backend-lint` — ESLint
2. `backend-test` — Jest (runInBand)
3. `backend-build` — NestJS build + prisma validate

**Frontend:**
1. `frontend-lint` — Next.js lint
2. `frontend-build` — Next.js build (standalone)

Los jobs de backend y frontend corren **en paralelo entre sí**, pero cada cadena es secuencial.

### PRs hacia `production` — jobs de gate:
- `release-backend-build` — Build de producción
- `release-frontend-build` — Build de producción con `NEXT_PUBLIC_BACKEND_URL=https://apicolegio.celebrali.com`

---

## CD Workflow

**Archivo:** `.github/workflows/cd.yml`  
**Trigger:** `push` a `production`

### Jobs en orden:

1. **`preflight`** — Valida que todos los secrets requeridos estén seteados.
2. **`build-backend`** — Construye imagen Docker del backend y la pushea a Docker Hub.
3. **`build-frontend`** — Construye imagen Docker del frontend (Next.js standalone) y la pushea.
4. **`deploy`** — SSH al VPS, escribe `.env`, hace `docker compose pull + up -d`.

Los jobs 2 y 3 corren en **paralelo**; el deploy espera ambos.

---

## Dockerfiles

| Archivo | Descripción |
|---------|-------------|
| `devops/docker/Dockerfile.backend` | Multi-stage: deps → builder → runner (NestJS) |
| `devops/docker/Dockerfile.frontend` | Multi-stage: deps → builder → runner (Next.js standalone) |
| `devops/docker/docker-compose.prod.yml` | Orquestación de postgres + backend + frontend con labels Traefik |

---

## URLs de producción

| Servicio | URL |
|---------|-----|
| Frontend | https://appcolegio.celebrali.com |
| Backend API | https://apicolegio.celebrali.com |

---

## Puertos internos (VPS)

| Servicio | Puerto interno |
|---------|---------------|
| Backend (NestJS) | `5000` |
| Frontend (Next.js) | `2000` |
| PostgreSQL | `5432` (privado, sin publicar al host) |

Traefik escucha en `80` / `443` y hace routing por dominio hacia los contenedores.

---

## GitHub Secrets requeridos

Configurar en: **Settings → Secrets and variables → Actions**

| Secret | Descripción |
|--------|-------------|
| `VPS_HOST` | IP del VPS (`77.42.83.15`) |
| `VPS_USER` | Usuario SSH (`admin`) |
| `VPS_PORT` | Puerto SSH (`22`) |
| `VPS_KEY` | Clave privada SSH (contenido de `~/.ssh/id_rsa`) |
| `APP_PATH` | Ruta en VPS donde clonar el repo (ej. `/opt/school-management`) |
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_USER` | Usuario de Postgres |
| `POSTGRES_PASSWORD` | Contraseña de Postgres |
| `BETTER_AUTH_SECRET` | Secret de Better Auth |
| `ADMIN_EMAIL` | Email del usuario admin seed |
| `ADMIN_PASSWORD` | Contraseña del usuario admin seed |
| `REGISTRY_USERNAME` | Usuario de Docker Hub |
| `REGISTRY_TOKEN` | Token de Docker Hub (PAT) |

---

## Imágenes Docker Hub

| Imagen | Etiquetas |
|--------|-----------|
| `<REGISTRY_USERNAME>/school-backend` | `<sha>`, `latest` |
| `<REGISTRY_USERNAME>/school-frontend` | `<sha>`, `latest` |

---

## Primer deploy (manual bootstrap)

Antes del primer CD automático, hacer en el VPS:

```bash
# 1. Crear red proxy_net si no existe
docker network create proxy_net 2>/dev/null || true

# 2. Verificar que Traefik está corriendo y conectado a proxy_net
docker ps | grep traefik

# 3. El CD creará /opt/school-management automáticamente al hacer el primer push a production
```

---

## Checklist de release

1. ✅ Merge de feature PR a `develop` — CI verde.
2. ✅ Abrir PR `develop → production`.
3. ✅ CI gate verde (`release-backend-build`, `release-frontend-build`).
4. ✅ Merge a `production`.
5. ✅ CD jobs pasan: `preflight` → `build-backend/frontend` → `deploy`.
6. ✅ Verificar `https://appcolegio.celebrali.com` y `https://apicolegio.celebrali.com/api`.

---

## Troubleshooting rápido

| Síntoma | Causa probable | Fix |
|---------|---------------|-----|
| `ssh: unable to authenticate` | Secret `VPS_KEY` incorrecto | Regenerar y actualizar secret |
| Docker push falla | Token expirado | Crear nuevo PAT en Docker Hub |
| Frontend 502 | Backend no levantó | `docker logs school-backend-1` |
| Traefik no rutea | Red `proxy_net` no existe | `docker network create proxy_net` |
| Prisma migrate falla | DB no lista | Revisar healthcheck del contenedor postgres |
| `standalone` build no encuentra archivos estáticos | `output: standalone` no configurado | Verificar `frontend/next.config.ts` |

---

## Estructura de archivos relevantes

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml          ← CI (lint + test + build)
│       └── cd.yml          ← CD (push images + deploy VPS)
├── devops/
│   ├── RUNBOOK.md          ← Este archivo
│   └── docker/
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       └── docker-compose.prod.yml
├── backend/                ← NestJS API (puerto 5000)
└── frontend/               ← Next.js App (puerto 2000)
```
