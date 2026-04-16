# Contribuir

Gracias por tu interés en contribuir.

## Reglas

- No se permiten commits directos a `main`.
- Todo cambio debe entrar mediante **Pull Request**.
- Los PRs deben ser revisados y aprobados por el owner del repositorio (**@rogerinfas**).

## Flujo de trabajo

1. Clona el repo y ejecuta `pnpm install` en la **raíz** (activa Husky).
2. Según lo que vayas a tocar, instala dependencias en **`backend/`** y/o **`prototype/`** con `pnpm install` en cada carpeta (proyectos independientes; cada uno tiene su `pnpm-lock.yaml`).
3. Crea un branch desde `main` (o haz fork si no tienes permisos de push).
4. Usa [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, etc.); `commitlint` se aplica si tienes `node_modules` en backend o prototype.
5. Abre un Pull Request apuntando a `main` y describe el cambio y cómo se probó.

### Comprobaciones locales útiles

- Backend: `pnpm -C backend lint`, `pnpm -C backend test`, `pnpm -C backend build`
- Prototipo UI: `pnpm -C prototype lint`, `pnpm -C prototype build`

## Buenas prácticas

- Mantén el PR pequeño y enfocado.
- Incluye evidencia o pasos de verificación cuando aplique.

