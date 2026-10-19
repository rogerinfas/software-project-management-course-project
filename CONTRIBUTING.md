# Contribuir

Gracias por tu interés en contribuir.

## Reglas

- No se permiten commits directos a `develop`.
- Todo cambio debe entrar mediante **Pull Request**.
- Los PRs deben ser revisados y aprobados por el owner del repositorio (**@rogerinfas**).

## Flujo de trabajo

1. Clona el repo.
2. Según lo que vayas a tocar, instala dependencias en **`backend/`** y/o **`frontend/`** con `pnpm install` en cada carpeta (proyectos independientes; cada uno tiene su `pnpm-lock.yaml`).
3. Crea un branch desde `develop` (o haz fork si no tienes permisos de push).
4. Usa [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, etc.).
5. Abre un Pull Request apuntando a `develop` y describe el cambio y cómo se probó.

### Comprobaciones locales útiles

- Backend: `pnpm -C backend lint`, `pnpm -C backend test`, `pnpm -C backend build`
- Frontend: `pnpm -C frontend lint`, `pnpm -C frontend build`

## Buenas prácticas

- Mantén el PR pequeño y enfocado.
- Incluye evidencia o pasos de verificación cuando aplique.

