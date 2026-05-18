# 🔑 Documentación de Rutas de Autenticación (Better Auth)

Este backend utiliza **Better Auth** (a través de `@thallesp/nestjs-better-auth`) para gestionar de forma completa y extremadamente segura todo el flujo de sesiones, logins, registros y cookies.

Todas las rutas de autenticación se encuentran expuestas bajo el prefijo **`/api/auth`** y son **públicas por defecto** (el guard de seguridad global las ignora automáticamente).

---

## 📚 Enlaces de Interés
*   **Documentación Interactiva (Scalar):** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
*   **Documentación Clásica (Swagger):** [http://localhost:5000/api/swagger](http://localhost:5000/api/swagger)

---

## 🚀 Endpoints Principales

A continuación se detallan las rutas que el frontend consumirá para autenticar usuarios:

### 1. Iniciar Sesión (Login)
*   **Endpoint:** `POST /api/auth/sign-in/email`
*   **Content-Type:** `application/json`
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "session": {
        "id": "session-uuid",
        "createdAt": "2026-05-18T20:00:00.000Z",
        "updatedAt": "2026-05-18T20:00:00.000Z",
        "userId": "user-uuid",
        "expiresAt": "2026-06-17T20:00:00.000Z",
        "token": "session-token",
        "ipAddress": "127.0.0.1",
        "userAgent": "Mozilla/5.0..."
      },
      "user": {
        "id": "user-uuid",
        "email": "user@example.com",
        "emailVerified": true,
        "name": "John Doe",
        "image": null,
        "role": "ADMIN",
        "createdAt": "2026-05-18T19:50:00.000Z",
        "updatedAt": "2026-05-18T19:50:00.000Z"
      }
    }
    ```
*   **Cookies Generadas (HTTPOnly, Secure en producción):**
    *   `better-auth.session_token`: Contiene el token de sesión. Esta cookie se envía automáticamente en cada petición posterior.

---

### 2. Obtener Sesión Actual (Get Session)
*   **Endpoint:** `GET /api/auth/get-session`
*   **Headers Requeridos:** Ninguno en navegadores (las cookies se envían solas si configuras `credentials: 'include'`).
*   **Response (200 OK - Logueado):**
    *   Retorna exactamente el mismo JSON de sesión y usuario que el `/sign-in/email`.
*   **Response (200 OK - No Logueado o Sesión Expirada):**
    *   `null`

---

### 3. Cerrar Sesión (Logout)
*   **Endpoint:** `POST /api/auth/sign-out`
*   **Content-Type:** `application/json`
*   **Request Body:** `null` o `{}`
*   **Response (200 OK):**
    ```json
    {
      "success": true
    }
    ```
*   **Efecto:** Invalida la sesión activa en la base de datos y destruye la cookie de sesión `better-auth.session_token` del navegador.

---

### 4. Registro de Usuarios (Sign Up)
*   **Endpoint:** `POST /api/auth/sign-up/email`
*   **Content-Type:** `application/json`
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe",
      "image": "https://avatar-url.com/image.png"
    }
    ```
*   **Response (200 OK):**
    *   Retorna el objeto combinado `{ session, user }` y loguea automáticamente al usuario en el navegador con su respectiva cookie.

---

## 💻 Integración en el Frontend

### Opción A: Usando el Cliente Oficial de Better Auth (Recomendado)
Better Auth provee un cliente SDK liviano y tipado. 

1. Instalar en el frontend:
   ```bash
   pnpm add better-auth
   ```
2. Crear el cliente de autenticación (`auth-client.ts`):
   ```typescript
   import { createAuthClient } from "better-auth/react"; // O vue, svelte, vanilla

   export const authClient = createAuthClient({
       baseURL: "http://localhost:5000" // URL del Backend
   });
   ```
3. Consumir las funciones en tus componentes:
   ```typescript
   // Iniciar sesión
   const { data, error } = await authClient.signIn.email({
       email: "user@example.com",
       password: "password123"
   });

   // Obtener sesión
   const { data: session } = await authClient.useSession();

   // Cerrar sesión
   await authClient.signOut();
   ```

### Opción B: Usando fetch nativo (Sin SDK)
Si prefieres consumir los endpoints directamente con `fetch` o `axios` en el frontend, recuerda **habilitar siempre el envío de cookies (`credentials: 'include'`)**:

```typescript
// Ejemplo de Login
const response = await fetch("http://localhost:5000/api/auth/sign-in/email", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "user@example.com",
        password: "password123"
    }),
    credentials: "include" // ¡CRÍTICO para guardar las cookies de sesión!
});

const data = await response.json();
```

---

## 🔒 Seguridad y Configuración del Backend
*   **Cookies Protegidas:** Las cookies de sesión están marcadas como `httpOnly: true` (inaccesibles por JavaScript del navegador frente a ataques XSS) y `sameSite: 'lax'` en desarrollo.
*   **IPs de Desarrollo Permitidas (CORS):** El backend tiene configurado aceptar credenciales y solicitudes de origen cruzado de los siguientes dominios:
    *   `http://localhost:3000` (Frontend local Next.js/Vite)
