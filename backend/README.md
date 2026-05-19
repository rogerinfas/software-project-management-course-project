# 🏫 Colegio Madre Santa Beatriz - Guía de Servicios y Documentación del Backend

Esta guía centraliza toda la información técnica sobre el backend, base de datos, documentación interactiva y administración de datos de la plataforma institucional.

---

## 🛠️ Servicios Activos y Puertos

| Servicio | URL de Acceso / Conexión | Descripción |
| :--- | :--- | :--- |
| **API REST (NestJS)** | [http://localhost:5000/api](http://localhost:5000/api) | Servidor backend principal en NodeJS. |
| **Documentación Scalar** | [http://localhost:5000/api/docs](http://localhost:5000/api/docs) | Documentación interactiva de última generación (Scalar). |
| **Documentación Swagger** | [http://localhost:5000/api/swagger](http://localhost:5000/api/swagger) | Interfaz clásica de Swagger UI. |
| **Base de Datos (PostgreSQL)** | `localhost:4900` | Servidor de base de datos relacional PostgreSQL expuesto al host. |
| **pgAdmin 4 (Administración)** | [http://localhost:5050](http://localhost:5050) | Gestor web de PostgreSQL (Contenedor Docker). |
| **Prisma Studio (GUI)** | [http://localhost:5555](http://localhost:5555) | Explorador y editor visual de base de datos relacional. |

---

## 🗄️ Base de Datos (Docker & PostgreSQL)

La base de datos corre dentro de un contenedor Docker aislado y se expone al host en el puerto **`4900`** para evitar colisiones con otros servicios PostgreSQL locales.

### 🔑 Credenciales de Conexión
* **Host:** `localhost` o `127.0.0.1`
* **Puerto Host:** **`4900`**
* **Puerto Interno (Docker):** `5432`
* **Usuario:** `postgres`
* **Contraseña:** `postgres`
* **Base de Datos:** `school_management`
* **URL de Conexión (Prisma / Backend):**
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:4900/school_management?schema=public"
  ```

### 🐘 Control de Contenedores (Docker Compose)
Para gestionar el ciclo de vida de la base de datos y pgAdmin:
```bash
# Apagar contenedores y limpiar redes
docker compose down

# Levantar contenedores en segundo plano (Recomendado)
docker compose up -d

# Ver registros de ejecución (logs)
docker compose logs -f
```

---

## 🔑 Cuentas Base Autogeneradas (Seed Data)

Cada vez que el backend se inicia, verifica la existencia de estos usuarios de prueba y los inserta/actualiza en la base de datos automáticamente:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **ADMIN** | `admin@santabeatriz.com` | `Admin123!` |
| **TEACHER** | `teacher@santabeatriz.com` | `Teacher123!` |
| **STAFF** | `staff@santabeatriz.com` | `Staff123!` |
| **ADMISSION** | `admission@santabeatriz.com` | `Admission123!` |
| **TREASURY** | `treasury@santabeatriz.com` | `Treasury123!` |

---

## 🔮 Prisma Studio (Administración Visual)

**Prisma Studio** te permite explorar, filtrar, agregar y editar registros en tiempo real en la base de datos a través de una interfaz de usuario limpia e intuitiva en tu navegador.

### 🚀 Levantar Prisma Studio
Si no está activo, puedes levantarlo en tu terminal desde la carpeta `backend/` con el siguiente comando para evitar apertura automática de navegadores del sistema:
```bash
pnpm exec prisma studio --port 5555 --browser none
```
Acceso en el navegador: 👉 **[http://localhost:5555](http://localhost:5555)**

---

## 📖 Endpoints del API REST y Autenticación

El API está completamente estructurado de forma modular y cuenta con soporte nativo de sesiones a través de **Better Auth**.

### 🔐 Autenticación (Better Auth endpoints)
Todos los flujos de autenticación e inicio de sesión pasan por el prefijo `/api/auth`:

* **POST** `/api/auth/sign-in/email` — Inicio de sesión con correo y contraseña.
* **POST** `/api/auth/sign-up/email` — Registro de nuevos usuarios.
* **POST** `/api/auth/sign-out` — Cierre seguro de sesión (borra cookies).
* **GET** `/api/auth/get-session` — Obtención de la sesión activa del usuario.

### 👥 Administración de Usuarios (`/api/users`)
* **GET** `/api/users` — Lista todos los usuarios registrados (con filtros opcionales).
* **POST** `/api/users` — Crea un nuevo usuario de forma administrativa.
* **GET** `/api/users/:id` — Retorna el detalle de un usuario específico.
* **PUT** `/api/users/:id` — Actualiza un usuario específico.
* **DELETE** `/api/users/:id` — Realiza borrado lógico o físico de un usuario.

---

## 🏗️ Comandos de Desarrollo del Backend

Ejecuta estos comandos dentro del directorio `backend/`:

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor en modo desarrollo con auto-recarga (watch mode)
pnpm run start:dev

# Generar cliente de Prisma tras modificar el schema
pnpm exec prisma generate

# Aplicar migraciones a la base de datos
pnpm exec prisma migrate dev
```
