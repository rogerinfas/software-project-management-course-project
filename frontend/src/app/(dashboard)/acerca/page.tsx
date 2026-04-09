import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AcercaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Acerca del prototipo
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Referencia a exclusiones y requisitos no funcionales del documento
          inicial (req.txt).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fuera de alcance (exclusiones)</CardTitle>
          <CardDescription>Según el documento de requerimientos:</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm">
            <li>
              <strong>Registro pedagógico:</strong> no se ingresan notas ni
              competencias; se sigue usando Excel / SIAGIE del Minedu.
            </li>
            <li>
              <strong>Exámenes en línea:</strong> no hay plataforma de
              evaluación.
            </li>
            <li>
              <strong>Contabilidad completa:</strong> no hay libros diarios ni
              mayores; solo registro de ingresos.
            </li>
            <li>
              <strong>Inventario:</strong> no se controla stock de útiles ni
              mobiliario.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atributos de calidad (prototipo UI)</CardTitle>
          <CardDescription>
            En producción, el backend NestJS cubriría lo siguiente; aquí solo se
            documenta la intención.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Seguridad</p>
            <p className="text-muted-foreground mt-1">
              Contraseñas con bcrypt, sesiones con JWT (este prototipo no
              implementa autenticación real).
            </p>
          </div>
          <div>
            <p className="font-medium">Disponibilidad</p>
            <p className="text-muted-foreground mt-1">
              Despliegue en la nube (p. ej. AWS / DigitalOcean) para acceso
              estable desde móvil pese a internet local variable.
            </p>
          </div>
          <div>
            <p className="font-medium">Trazabilidad</p>
            <p className="text-muted-foreground mt-1">
              Cada movimiento de dinero registra quién cobró, cuándo, monto y si
              hubo edición posterior — ver módulo{" "}
              <a className="text-primary underline" href="/config/auditoria">
                Auditoría
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
