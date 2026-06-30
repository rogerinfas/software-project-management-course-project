import * as React from "react";
import { Contact } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StudentSelectorProps {
  students: any[];
  studentId: string;
  setStudentId: (id: string) => void;
  setEditId: (id: string | null) => void;
}

export function StudentSelector({ students, studentId, setStudentId, setEditId }: StudentSelectorProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <CardTitle className="text-base font-sans flex items-center gap-2">
          <Contact className="size-4.5 text-primary" /> Seleccionar Alumno
        </CardTitle>
        <CardDescription className="font-sans">
          Elija un estudiante matriculado para ver su expediente y vínculos familiares.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-md">
        <select
          className="w-full border border-border/80 bg-background hover:bg-muted/10 h-10 rounded-xl px-3 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            setEditId(null);
          }}
        >
          {students.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.code || "REGISTRO NUEVO"} — {s.lastName}, {s.firstName} ({s.dni})
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
}
