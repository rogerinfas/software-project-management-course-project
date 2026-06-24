He definido estos 5 roles específicos para cubrir todas las áreas operativas del colegio definidas en el alcance, manteniendo el principio de "mínimo privilegio" para la seguridad de los datos:

ADMIN (Administrador del Sistema):
Justificación: Es el superusuario. Tiene acceso a la configuración global (etapas de admisión, parámetros de tesorería, reglas de asistencia) y puede gestionar otros usuarios. Es el único que debería poder modificar el esquema de base de datos o configuraciones críticas.


TEACHER (Docente):
Justificación: Vinculado al Módulo 3 (Gestión Académica). Su acceso está limitado a ver sus horarios (Schedules), las secciones a las que está asignado y la lista de alumnos bajo su cargo. No necesita acceso a la parte financiera ni al pipeline de admisión.

ADMISSION (Asesor de Admisiones):
Justificación: Centralizado en el Módulo 1 (Admisión). Gestiona el Pipeline CRM, agenda citas y registra los dictámenes de evaluación. Es un rol "front-deck" que maneja el primer contacto con el cliente antes de que se convierta en alumno oficial.

TREASURY (Tesorero / Caja):
Justificación: Exclusivo para el Módulo 4 (Tesorería). Puede emitir cargos, registrar pagos y ver estados de cuenta. Por seguridad financiera, este rol suele estar separado del resto para evitar manipulaciones de saldos por personal no autorizado.

STAFF (Administrativo / RRHH):
Justificación: Cubre la parte logística de la Matrícula (Módulo 2). Se encarga del soporte operativo del proceso de matriculación. El Módulo 5 (Personal y Asistencia) fue eliminado del alcance actual del proyecto.

---

## Visibilidad de módulos por rol (Frontend)

El rol del usuario se obtiene del backend vía `/api/auth/get-session` y se usa en el frontend para filtrar qué módulos aparecen en el sidebar. El mapeo es estático (configuración de aplicación, no persiste en BD).

| Módulo / Sección                      | ADMIN | ADMISSION | TREASURY | TEACHER | STAFF |
|---------------------------------------|:-----:|:---------:|:--------:|:-------:|:-----:|
| Panel (Dashboard `/`)                 | ✅    | ✅        | ✅       | ✅      | ✅    |
| Landing pública                       | ✅    | ✅        | ✅       | ✅      | ✅    |
| **M1 – Admisión**                     | ✅    | ✅        | ❌       | ❌      | ❌    |
| **M2 – Matrícula**                    | ✅    | ✅        | ❌       | ❌      | ✅    |
| **M3 – Académica & Comunicación**     | ✅    | ❌        | ❌       | ✅      | ❌    |
| **M4 – Tesorería**                    | ✅    | ❌        | ✅       | ❌      | ❌    |
| Gestión de Usuarios *(futuro)*        | ✅    | ❌        | ❌       | ❌      | ❌    |

> **Regla general:** `ADMIN` ve todo. Cada rol especializado ve únicamente el/los módulo(s) de su área.

### Implementación en el frontend

El filtrado se aplica en `app-sidebar.tsx`. Cada grupo del array `nav` tiene un campo `roles: Role[]`. Al renderizar, solo se muestran los grupos cuyo `roles` incluye el rol del usuario activo obtenido de la sesión.