import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MODULES = [
  {
    code: "M1",
    title: "Admisión (CRM)",
    items: [
      "A-1 · Configuración del proceso (etapas, requisitos por nivel).",
      "A-2 · CRM con pipeline Kanban e historial de interacciones.",
      "A-3 · Repositorio digital de documentos del postulante.",
    ],
  },
  {
    code: "M2",
    title: "Matrícula",
    items: [
      "B-1 · Expediente familiar (apoderados, hermanos, datos médicos).",
      "B-2 · Formalización con validación de aforo y deuda previa.",
      "B-3 · Emisión PDF de ficha de matrícula y contrato.",
    ],
  },
  {
    code: "M3",
    title: "Académica y comunicación",
    items: [
      "C-1 · Malla curricular y carga docente por sección.",
      "C-2 · Horarios por sección y disponibilidad de aulas.",
      "C-3 · Panel de comunicados (categoría, vigencia, visibilidad).",
      "C-4 · Landing pública de avisos (sin login).",
    ],
  },
  {
    code: "M4",
    title: "Tesorería",
    items: [
      "D-1 · Tarifario (admisión, matrícula, pensiones, extras).",
      "D-2 · Cobranzas (pagos manuales y búsqueda de estado de cuenta).",
      "D-3 · Comprobantes internos en PDF + monitor de morosidad.",
    ],
  },
  {
    code: "M5",
    title: "Personal y asistencia",
    items: [
      "E-1 · Gestión de RR.HH. (docentes y administrativos).",
      "E-2 · Control de asistencia por reconocimiento facial.",
      "E-3 · Motor de reglas y sanciones (multa por minuto).",
      "E-4 · Reporte de pre-planilla consolidada.",
    ],
  },
];

const EXCLUSIONES = [
  "Registro pedagógico (notas, competencias, capacidades).",
  "Exámenes en línea.",
  "Contabilidad completa (libros diarios / mayores).",
  "Facturación electrónica SUNAT.",
  "Control de inventario.",
  "Exportación SIAGIE (fuera del prototipo).",
];

export default function AcercaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Alcance del sistema (EDT)
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Resumen del documento{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">alcance.md</code>.
          El EDT define 5 módulos y 17 funcionalidades dentro del alcance; el resto
          queda explícitamente fuera.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((m) => (
          <Card key={m.code}>
            <CardHeader>
              <CardTitle className="text-base">
                {m.code} · {m.title}
              </CardTitle>
              <CardDescription>
                Ver implementación en el módulo correspondiente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exclusiones explícitas</CardTitle>
          <CardDescription>
            Funcionalidades que no forman parte del alcance de este prototipo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {EXCLUSIONES.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reglas de negocio priorizadas</CardTitle>
          <CardDescription>Implementadas en el prototipo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Aforo: bloqueo de matrícula si la sección está llena.</li>
            <li>
              Responsable económico con deuda pendiente bloquea matrícula.
            </li>
            <li>
              Prelación de pagos: se aplican primero a las deudas más antiguas.
            </li>
            <li>
              Motor de sanciones: multa por minuto con tramos configurables.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
