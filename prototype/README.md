# Prototipo de interfaz (Next.js)

Este directorio **no es la aplicación web de producción**. Es un **prototipo** pensado para **esquematizar** la aplicación web del proyecto: flujos, pantallas, navegación y componentes de UI, con datos de demostración o mocks cuando haga falta.

El **frontend definitivo** del monorepo vive en [`../frontend`](../frontend); aquí solo se itera el diseño y la experiencia para alinear alcance y requisitos antes de implementar la solución final.

## Qué esperar de este código

- Rutas y layouts orientados a explorar el dominio (admisión, tesorería, reportes, etc.).
- Contenido que puede ser **placeholder**, **mock** o **solo lectura**; no asumas que refleja APIs reales ni reglas de negocio finales.
- Cambios frecuentes mientras el equipo valida la propuesta de producto.

## Cómo ejecutarlo (monorepo con pnpm)

Desde la raíz del repositorio:

```bash
pnpm -C prototype dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Otros comandos útiles:

```bash
pnpm -C prototype build
pnpm -C prototype lint
```

## Stack técnico (referencia)

Proyecto [Next.js](https://nextjs.org) (App Router), con la configuración habitual de `create-next-app`. Para profundizar en Next.js, consulta la [documentación oficial](https://nextjs.org/docs).
