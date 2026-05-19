# 🖥️ Colegio Madre Santa Beatriz - Guía de Servicios y Documentación del Frontend

Esta guía centraliza toda la información técnica sobre el frontend de la plataforma institucional (Next.js, Tailwind CSS, Base UI, TanStack Query y Better Auth).

---

## 🛠️ Arquitectura y Stack Tecnológico

El frontend está desarrollado sobre las últimas convenciones de Next.js y React, priorizando una interfaz de usuario premium con animaciones fluidas y accesibilidad total.

* **Framework:** Next.js (App Router)
* **Tipografía:** [Outfit (Google Fonts)](https://fonts.google.com/specimen/Outfit)
* **Librería de Componentes:** [Base UI (@base-ui/react)](https://base-ui.com/)
* **Consultas e Integración de Datos:** [TanStack Query (@tanstack/react-query)](https://tanstack.com/query/latest)
* **Cliente de Autenticación:** Better Auth (con cookies de sesión seguras)
* **Estilos:** Tailwind CSS y CSS nativo con variables de diseño en formato **OKLCH / HSL** azul-acero.

---

## 📂 Estructura de Directorios

El enrutamiento está estructurado de forma **física y modular** bajo las directivas del EDT (Estructura de Desglose de Trabajo). Todas las carpetas se encuentran estrictamente nombradas en **inglés** para consistencia con los controladores del backend:

```text
frontend/
├── public/                     # Recursos visuales y estáticos (ej. escudos, héroe)
└── src/
    ├── app/
    │   ├── (dashboard)/        # Layout administrativo con barra lateral (AppSidebar)
    │   │   ├── about/          # Información del colegio
    │   │   ├── academic/       # Módulo Académico (Malla, Horarios, Secciones, Carga Docente, Comunicados)
    │   │   ├── admission/      # Módulo Admisiones (Pipeline, Citas, Criterios, Evaluación, Documentos)
    │   │   ├── enrollment/     # Módulo Matrículas (Expedientes, Apoderados, Formalización, Documentos)
    │   │   ├── staff/          # Módulo Personal/RRHH (RRHH, Reconocimiento, Reglas, Pre-Planilla)
    │   │   ├── treasury/       # Módulo Tesorería (Tarifario, Cobranzas, Comprobantes)
    │   │   ├── layout.tsx      # Barra lateral colapsable, breadcrumbs y control de temas
    │   │   └── page.tsx        # Panel central administrativo "En Construcción"
    │   ├── landing/            # Página de bienvenida institucional pública (vista completa sin sidebar)
    │   ├── login/              # Portal de inicio de sesión administrativo unificado
    │   └── layout.tsx          # Proveedores globales de Outfit, React Query y Temas
    ├── components/
    │   ├── ui/                 # Componentes interactivos base del prototipo original (Base UI / Radix)
    │   ├── app-sidebar.tsx     # Definición lógica y enlaces del panel de control
    │   └── mode-toggle.tsx     # Selector dinámico de temas (Claro / Oscuro / Sistema)
    └── lib/
        └── api/                # Cliente de consumo HTTP generado de openapi-fetch
```

---

## 🌐 Variables de Entorno (.env)

El frontend requiere configurar la URL base de tu backend de NestJS en un archivo local:

### Archivos de Configuración
* **Plantilla Base:** [frontend/.env.example](file:///home/acide/Escritorio/universidad/software-project-management-course-project/frontend/.env.example)
* **Configuración Local:** [frontend/.env](file:///home/acide/Escritorio/universidad/software-project-management-course-project/frontend/.env) *(ignorado en git)*
  ```env
  NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
  ```

---

## 🎨 Guía de Estilo Visual y UI

La plataforma implementa una interfaz premium que "asombra" al primer contacto visual:

1. **Tipografía Outfit:** Configurada de forma global en `src/app/layout.tsx`. Se utiliza de manera declarativa con la variable `--font-outfit`.
2. **Tema de Color Azul Acero:** Definido en HSL/OKLCH para un contraste visual agradable que soporta automáticamente **Modo Oscuro** y **Modo Claro**.
3. **Breadcrumbs Localizados:** Las URL físicas están en inglés (`/admission/pipeline`), pero se interceptan en `layout.tsx` a través del diccionario `ROUTE_TRANSLATIONS` para presentarse de manera elegante en español:
   - `/admission` ➔ `Admisión`
   - `/enrollment/formalizacion` ➔ `Matrículas · Formalización`

---

## 🏗️ Comandos de Desarrollo del Frontend

Ejecuta estos comandos dentro del directorio `frontend/`:

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo (Next.js Turbopack)
pnpm run dev

# Generar la compilación optimizada de producción
pnpm run build

# Levantar la compilación de producción de forma local
pnpm run start
```
