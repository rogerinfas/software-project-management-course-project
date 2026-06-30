import * as React from "react";
import { FileText, Search, Printer, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentsTableProps {
  search: string;
  setSearch: (val: string) => void;
  setPage: (val: number | ((prev: number) => number)) => void;
  page: number;
  isLoading: boolean;
  list: any[];
  enrollmentsData: any;
  setSelectedEnrollmentId: (id: string) => void;
  setPreviewTipo: (tipo: "ficha_matricula" | "contrato_servicios") => void;
  handleReemit: (e: any) => void;
}

export function DocumentsTable({
  search,
  setSearch,
  setPage,
  page,
  isLoading,
  list,
  enrollmentsData,
  setSelectedEnrollmentId,
  setPreviewTipo,
  handleReemit,
}: DocumentsTableProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="size-4.5 text-primary" /> Alumnos Matriculados
            </CardTitle>
            <CardDescription>
              Visualice, imprima o re-emita los expedientes oficiales de matrícula del año lectivo en curso.
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por DNI o nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando expedientes académicos...</p>
          </div>
        ) : (
          <div className="border border-border/60 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Código de Estudiante</TableHead>
                  <TableHead>DNI Alumno</TableHead>
                  <TableHead>Sección Asignada</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground text-center py-6 text-sm">
                      No se encontraron registros de matrícula.
                    </TableCell>
                  </TableRow>
                )}
                {list.map((e: any) => (
                  <TableRow key={e.id} className="hover:bg-muted/10">
                    <TableCell className="font-semibold text-foreground">
                      {e.student?.firstName} {e.student?.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.student?.code || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{e.student?.dni}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {e.student?.section ? `${e.student.section.grade} - ${e.student.section.name}` : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(e.date).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell className="text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEnrollmentId(e.id);
                          setPreviewTipo("ficha_matricula");
                        }}
                        className="cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="size-3" /> Ver Expediente
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReemit(e)}
                        className="cursor-pointer inline-flex items-center gap-1"
                      >
                        <Printer className="size-3" /> Re-emitir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {enrollmentsData?.meta && enrollmentsData.meta.totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="cursor-pointer"
            >
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground">
              Página {page} de {enrollmentsData.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(enrollmentsData.meta.totalPages, p + 1))}
              disabled={page === enrollmentsData.meta.totalPages}
              className="cursor-pointer"
            >
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
