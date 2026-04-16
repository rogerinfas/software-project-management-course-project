# Alcance — Sistema de Gestión Académica (IEP Madre Santa Beatriz)

> Documento de alcance derivado del **Árbol de Descomposición del Trabajo (EDT)**.
> Sustituye al antiguo `req.txt`. Es la fuente de verdad para el prototipo (`/prototype`) y
> delimita **qué entra** y **qué queda fuera** de este proyecto académico.

---

## 1. Objetivo

Construir un prototipo navegable, con **datos de demostración (mock)** en memoria, que
cubra los cinco módulos del EDT y sus funcionalidades asociadas. El prototipo sirve como
vitrina de alcance y como base para implementar el backend posteriormente.

---

## 2. Módulos y funcionalidades (EDT)

### MÓDULO 1 — Admisión (CRM de postulantes)

Responsable de captar y filtrar futuros estudiantes.

- **A-1. Configuración del proceso de admisión**
  - Definir etapas personalizables (Entrevista, Evaluación, Psicología, …).
  - Gestionar requisitos y documentos obligatorios por nivel educativo.
- **A-2. CRM de admisión (Pipeline Kanban)**
  - Tablero Kanban para seguimiento de prospectos.
  - Historial de interacciones con padres de familia.
- **A-3. Repositorio digital de documentos**
  - Carga, almacenamiento y validación de archivos (DNI, constancias, etc.).

### MÓDULO 2 — Matrícula (Alumnos y Apoderados)

Responsable de formalizar el ingreso de los alumnos aptos.

- **B-1. Expediente familiar**
  - Registro maestro de apoderados (contacto, parentesco, dato laboral).
  - Vinculación de hermanos y datos médicos del alumno.
- **B-2. Formalización y vacantes**
  - Validación de cupos por grado/sección.
  - Cambio de estado **Postulante → Alumno** con generación automática del código.
- **B-3. Emisión de documentos de matrícula**
  - Ficha de Matrícula y Contrato de Servicios Educativos en PDF (vista previa).

### MÓDULO 3 — Gestión Académica y Comunicación

Responsable del orden educativo y el contacto con la comunidad.

- **C-1. Malla curricular y carga docente**
  - Cursos por grado y asignación de profesores a secciones.
- **C-2. Gestión de horarios**
  - Calendarios de clases y disponibilidad de aulas físicas.
- **C-3. Panel de comunicados**
  - Editor (título, cuerpo, categoría) con control de vigencia y visibilidad.
- **C-4. Landing page de avisos (vista pública)**
  - Interfaz web simple para padres: ver noticias **sin iniciar sesión**.

### MÓDULO 4 — Tesorería (Gestión financiera de ingresos)

Responsable del flujo de caja y control de pagos.

- **D-1. Configuración de tarifario**
  - Montos para Admisión, Matrículas, Pensiones y conceptos extra.
- **D-2. Módulo de cobranzas**
  - Registro de pagos manuales.
  - Búsqueda rápida de estados de cuenta por alumno.
- **D-3. Comprobantes y reportes**
  - Generación de recibos internos en PDF (vista previa).
  - Monitor de morosidad del mes corriente.

### MÓDULO 5 — Personal y Asistencia (Control biométrico)

Responsable del personal y su puntualidad mediante reconocimiento facial.

- **E-1. Gestión de recursos humanos**
  - Registro de docentes y administrativos (datos personales, especialidad, horarios).
- **E-2. Control de asistencia por reconocimiento facial**
  - Marcado de entrada/salida con la cámara de la laptop.
- **E-3. Motor de reglas y sanciones**
  - Cálculo automático de tardanzas y configuración de “multas” por minuto.
- **E-4. Reporte de pre-planilla**
  - Consolidado para contabilidad: horas laboradas vs. descuentos.

---

## 3. Reglas de negocio priorizadas (prototipadas)

- **Aforo**: no se puede matricular si la sección alcanzó su capacidad máxima.
- **Bloqueo por deuda**: no se matricula si el **Responsable económico** tiene deuda
  pendiente de años anteriores.
- **Prelación de pagos**: los pagos se aplican primero a las deudas más antiguas.
- **Sanciones**: los minutos de tardanza acumulada se traducen en multa según la regla
  vigente (configurable).

---

## 4. Exclusiones explícitas

No forman parte del alcance de este prototipo (y, por tanto, no estarán presentes en la
navegación ni en los mocks):

1. **Registro pedagógico**: notas, competencias, capacidades — se mantiene SIAGIE/Excel.
2. **Exámenes en línea**: sin plataforma de evaluación.
3. **Contabilidad completa**: no hay libros diarios ni mayores; solo ingresos.
4. **Facturación electrónica SUNAT**: el EDT pide **comprobantes internos**; la emisión
   SUNAT queda fuera.
5. **Inventario**: no se controla stock de útiles ni mobiliario.
6. **Exportación SIAGIE**: queda fuera del prototipo (puede revisarse en otra fase).

---

## 5. Atributos de calidad (referenciales)

- **Seguridad**: contraseñas con bcrypt, sesiones con JWT (cuando exista backend).
- **Disponibilidad**: despliegue en la nube; acceso desde móvil del padre.
- **Trazabilidad**: toda acción sensible (pago, matrícula, edición) queda en log de
  auditoría del sistema final; en el prototipo se simula en memoria.

---

## 6. Mapa EDT → rutas del prototipo

| EDT  | Funcionalidad                          | Ruta del prototipo                        |
| ---- | -------------------------------------- | ----------------------------------------- |
| A-1  | Configuración del proceso              | `/admision/config`                        |
| A-2  | CRM Kanban + historial                 | `/admision/pipeline`                      |
| A-3  | Repositorio digital de documentos      | `/admision/documentos`                    |
| B-1  | Expediente familiar                    | `/matricula/expediente`                   |
| B-2  | Formalización y vacantes               | `/matricula/formalizacion`                |
| B-3  | Emisión de documentos de matrícula     | `/matricula/documentos`                   |
| C-1  | Malla curricular y carga docente       | `/academica/malla`                        |
| C-2  | Gestión de horarios                    | `/academica/horarios`                     |
| C-3  | Panel de comunicados                   | `/academica/comunicados`                  |
| C-4  | Landing pública de avisos              | `/landing` (fuera del dashboard)          |
| D-1  | Tarifario                              | `/tesoreria/tarifario`                    |
| D-2  | Cobranzas                              | `/tesoreria/cobranzas`                    |
| D-3  | Comprobantes y morosidad               | `/tesoreria/comprobantes`                 |
| E-1  | RR.HH.                                 | `/personal/rrhh`                          |
| E-2  | Reconocimiento facial                  | `/personal/reconocimiento`                |
| E-3  | Reglas de sanciones                    | `/personal/reglas`                        |
| E-4  | Pre-planilla                           | `/personal/pre-planilla`                  |

---

## 7. Estado de los datos

El prototipo **no** se conecta a un backend real. Todos los datos se encuentran
en `prototype/src/lib/mock/` y se exponen al árbol de React mediante
`DemoDataProvider` (`prototype/src/context/demo-data-context.tsx`).
