# Guía Maestra de Arquitectura e Implementación de Módulos

Esta guía es el **documento técnico oficial y definitivo** para el desarrollo en el backend de este proyecto. Su propósito es definir, estandarizar y hacer cumplir la arquitectura real, los patrones implícitos y las reglas de diseño que rigen el sistema.

El proyecto está diseñado sobre una arquitectura limpia orientada al dominio (**DDD - Domain-Driven Design**) combinada con Segregación de Responsabilidad de Comandos y Consultas (**CQRS**), montado sobre **NestJS**.

Cualquier nuevo módulo creado **debe** apegarse estrictamente a las capas, flujos y responsabilidades aquí expuestas.

---

## 1. Visión General del Flujo de Datos

El flujo de cualquier petición sigue una dirección unidireccional estricta:

1. **Presentation (Controlador):** Recibe HTTP, valida DTOs de entrada y despacha un `Command` o `Query`.
2. **Application (Use Case):** El `CommandHandler` o `QueryHandler` recibe el comando/consulta, orquesta la lógica, recupera entidades del dominio y ejecuta operaciones. Si se viola una regla de negocio, lanza una excepción de dominio pura.
3. **Domain (Entidades y Contratos):** Contiene la lógica pura, los tipos y las firmas de los repositorios. No sabe nada de HTTP ni de bases de datos.
4. **Infrastructure (Persistencia/Externos):** Implementa los contratos del dominio (ej. interactuando con Prisma) y devuelve siempre Entidades de Dominio puras.
5. **Filtro Global HTTP:** Captura las excepciones puras del dominio en la capa más alta y las traduce a códigos de estado HTTP seguros (ej. 404, 409).

---

## 2. Capa por Capa: Responsabilidades y Convenciones

### 2.1. Capa de Dominio (`src/domain/`)

Es el núcleo de la aplicación. **Cero dependencias de frameworks externos o librerías de infraestructura** (no Prisma, no HTTP, no Express).

*   **Carpeta:** `src/domain/entities/`
    *   **Propósito:** Clases puras de TypeScript que encapsulan el estado y la lógica de negocio intrínseca.
    *   **Convención de Naming:** `[modelo].entity.ts` -> `UserEntity`.
    *   **Dependencias Prohibidas:** DTOs, Prisma, Controladores.

*   **Carpeta:** `src/domain/repositories/`
    *   **Propósito:** Clases abstractas puras (usadas como interfaces para la Inyección de Dependencias de NestJS) que definen el contrato que la capa de infraestructura debe cumplir.
    *   **Convención de Naming:** `[modelo].repository.interface.ts` -> `IUserRepository`.
    *   **Obligatorio:** Los métodos deben recibir tipos nativos o clases del dominio y retornar Promesas de Entidades (`Promise<UserEntity>`) o Resultados Paginados (`PaginatedResult<UserEntity>`).

*   **Carpeta:** `src/domain/exceptions/`
    *   **Propósito:** Excepciones de negocio estructuradas de forma plana por modelo.
    *   **Estructura:** Un archivo base `domain-exception.ts` y un archivo por modelo `[modelo].exceptions.ts` (ej. `user.exceptions.ts`).
    *   **Regla Implícita:** Toda excepción de negocio debe extender de `DomainException`.

✅ **Checklist de Dominio:**
- [ ] ¿El código no tiene ninguna importación de `@nestjs/...` (salvo decoradores básicos si fuera estrictamente necesario, aunque preferible sin ellos)?
- [ ] ¿El código no importa nada de `Prisma` o `src/infrastructure`?
- [ ] ¿Las excepciones de dominio se agrupan en un solo archivo plano por modelo?
- [ ] ¿Los repositorios abstractos retornan entidades puras del dominio y no modelos crudos de Prisma?

---

### 2.2. Capa de Aplicación (`src/application/`)

Contiene los casos de uso específicos del negocio mediante CQRS.

*   **Carpeta:** `src/application/use-cases/[modulo]/commands/`
    *   **Propósito:** Casos de uso que **mutan** el estado (Crear, Actualizar, Eliminar).
    *   **Estructura:** Un archivo contiene tanto el `Command` (los datos) como su `CommandHandler` (la lógica).
    *   **Convención de Naming:** `[accion]-[modelo].command.ts` -> `create-user.command.ts`.
    *   **Flujo:** Inyecta repositorios (a través del token/clase abstracta del dominio), orquesta lógica, lanza excepciones del dominio si algo falla, y guarda en persistencia.

*   **Carpeta:** `src/application/use-cases/[modulo]/queries/`
    *   **Propósito:** Casos de uso que solo **leen** estado.
    *   **Convención de Naming:** `[accion].query.ts` -> `get-users.query.ts`.
    *   **Soporte de Paginación:** Las queries de listado deben estar preparadas para recibir opcionalmente `page` y `size`, delegando en `findManyPaginated` del repositorio.

✅ **Checklist de Aplicación (CQRS):**
- [ ] ¿El Handler inyecta el repositorio usando la interfaz abstracta del dominio (ej. `IUserRepository`) y no la implementación directa?
- [ ] ¿El Handler orquesta lógica pero no formatea datos HTTP ni interactúa con cookies/headers?
- [ ] ¿Las fallas de negocio lanzan explícitamente clases de error del dominio (ej. `throw new EmailAlreadyExistsException(email)`)?

---

### 2.3. Capa de Presentación (`src/presentation/`)

El punto de entrada al sistema.

*   **Carpeta:** `src/presentation/controllers/[modulo]/`
    *   **Propósito:** Declaración de rutas, Swagger, validación de entrada.
    *   **Convención de Naming:** `[modelo].controller.ts`.
    *   **Regla Crítica:** **El controlador NUNCA interactúa con Prisma ni con repositorios directamente**. Siempre inyecta `CommandBus` y `QueryBus`.
    *   **Mapeo:** Convierte los DTOs de entrada a `Commands` y transforma la Entidad retornada en DTOs de respuesta mediante `.toDto()`.

*   **Carpeta:** `src/presentation/controllers/[modulo]/dto/`
    *   **Propósito:** Validar la entrada (Request DTOs) y dar formato tipado a la salida (Response DTOs) para la documentación OpenAPI/Swagger.
    *   **Convenciones de Naming:**
        - Entrada: `[Accion][Modelo]Request` -> `CreateUserRequest`.
        - Salida: `[Modelo]Response` -> `UserResponse`.
        - Listado Paginado: `ResponsePaginated[Modelo]Dto` extendiendo de `BasePaginatedResponseDto`.
    *   **Exportación:** Todo debe exportarse en un archivo plano `index.ts` dentro de la carpeta `dto/`.

*   **Carpeta:** `src/presentation/filters/`
    *   **Propósito:** El `HttpExceptionFilter` atrapa todas las excepciones no controladas y los `DomainException`, mapeándolos de manera determinista y segura a respuestas HTTP estandarizadas.

✅ **Checklist de Presentación:**
- [ ] ¿El controlador está completamente anotado con decoradores de `@nestjs/swagger` (`@ApiOperation`, `@ApiResponse`, etc.)?
- [ ] ¿El controlador inyecta única y exclusivamente `CommandBus` y `QueryBus` (cero servicios o repositorios)?
- [ ] ¿Los DTOs usan validadores de `class-validator` y exponen sus propiedades con `@ApiProperty`?
- [ ] ¿Se respeta el DTO base de paginación para respuestas estructuradas?

---

### 2.4. Capa de Infraestructura (`src/infrastructure/`)

Conecta nuestro dominio puramente lógico con el mundo exterior.

*   **Carpeta:** `src/infrastructure/persistence/prisma/repositories/`
    *   **Propósito:** Implementa las interfaces de repositorio del dominio utilizando Prisma Client.
    *   **Convención de Naming:** `prisma-[modelo].repository.ts`.
    *   **Regla Crítica:** Es el **único lugar** donde Prisma puede importar modelos crudos (`import { User as PrismaUser } from '@prisma/client'`).
    *   **Mapeo de Salida:** Todas las consultas a Prisma DEBEN ser mapeadas a Entidades del Dominio antes de retornar (ej. `return new UserEntity(prismaRecord)`).

✅ **Checklist de Infraestructura:**
- [ ] ¿La clase implementa fielmente la clase abstracta del dominio (ej. `implements IUserRepository`)?
- [ ] ¿Se encarga exclusivamente del mapeo ORM -> Entidad y Entidad -> ORM?
- [ ] ¿Implementa correctamente la paginación de Prisma mediante `$transaction` (contando y haciendo un `.findMany` con `skip` y `take` simultáneamente)?

---

## 3. Paginación y Convenciones Transversales (`src/config/`)

El proyecto implementa un estándar de paginación estricto, retrocompatible y documentado (idéntico al patrón establecido en microservicios maduros).

*   **Peticiones (Request):** Se utiliza `PaginationQueryDto` que define `page` y `size` como campos opcionales sin valores por defecto rígidos, permitiendo que la capa de aplicación devuelva todo si no se proporcionan, o pagine si están presentes.
*   **Respuestas (Response):** Se debe retornar una clase que herede de `BasePaginatedResponseDto<T>`, la cual garantiza la estructura unificada de la respuesta:
    ```json
    {
      "data": [...],
      "meta": {
        "total": 100,
        "page": 1,
        "pageSize": 10,
        "totalPages": 10,
        "hasNext": true,
        "hasPrevious": false
      }
    }
    ```

---

## 4. Antipatrones Estrictamente Prohibidos

1. **Acoplamiento Prisma-Controller:** NUNCA inyectar `PrismaService` en un Controller o Handler de Aplicación. Siempre encapsular la persistencia detrás de una interfaz de Dominio (`IRepository`).
2. **DTOs en la capa de Dominio o Aplicación:** Los DTOs son exclusivos de la capa de Presentación. Los Comandos y Consultas deben transportar tipos primitivos, objetos genéricos o Entidades.
3. **Manejo de Errores Desacoplado:** NO atrapar excepciones localmente para retornar respuestas HTTP `400` en los Controladores. Deja que las excepciones de Dominio burbujeen y sean procesadas por el Filtro Global.
4. **Dependencias Circulares de Módulos:** Mantén los contextos delimitados. Si el módulo A requiere lógica del módulo B, el Módulo A debe inyectar la interfaz de lectura del Módulo B o usar eventos.

---

**Prioridad Absoluta:** La uniformidad. El éxito y la escalabilidad del sistema residen en mantener exactamente esta misma distribución de carpetas, responsabilidades aisladas y convenciones de nombres en la adición de cada nuevo módulo del proyecto.
