import * as React from "react";
import { Search, Loader2, Pencil, Trash2, Check, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GuardianFormValues } from "../../_types/guardians.types";

interface GuardiansTableProps {
  search: string;
  setSearch: (val: string) => void;
  setPage: (val: number | ((prev: number) => number)) => void;
  page: number;
  isLoading: boolean;
  list: any[];
  guardiansData: any;
  editId: string | null;
  setEditId: (val: string | null) => void;
  editForm: UseFormReturn<GuardianFormValues>;
  updateMutation: any;
  deleteMutation: any;
}

export function GuardiansTable({
  search,
  setSearch,
  setPage,
  page,
  isLoading,
  list,
  guardiansData,
  editId,
  setEditId,
  editForm,
  updateMutation,
  deleteMutation,
}: GuardiansTableProps) {
  const { formState: { errors: editErrors } } = editForm;

  function startEdit(g: any) {
    setEditId(g.id);
    editForm.setValue("name", g.name);
    editForm.setValue("dni", g.dni);
    editForm.setValue("phone", g.phone);
    editForm.setValue("email", g.email || "");
    editForm.setValue("occupation", g.occupation || "");
  }

  function saveEdit(data: GuardianFormValues) {
    if (!editId) return;
    if (!data.name.trim() || !data.dni.trim()) {
      toast.error("El nombre y el DNI son requeridos");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        dni: data.dni,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        occupation: data.occupation || undefined,
      },
    });
  }

  const handleDelete = (g: any) => {
    if (g.students && g.students.length > 0) {
      toast.warning("No puedes eliminar un apoderado que tiene alumnos asociados.");
      return;
    }
    if (confirm(`¿Seguro que deseas eliminar al apoderado "${g.name}"?`)) {
      deleteMutation.mutate({ params: { path: { id: g.id } } });
    }
  };

  return (
    <Card className="bg-card border-border/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Listado General</CardTitle>
            <CardDescription>
              Búsqueda en tiempo real por DNI o nombre completo. Edita datos de contacto en línea.
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
            <p className="text-muted-foreground text-sm">Cargando apoderados...</p>
          </div>
        ) : (
          <div className="border border-border/60 rounded-xl overflow-hidden">
            <Table className="table-fixed">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[18%]">Apoderado</TableHead>
                  <TableHead className="w-[11%]">DNI</TableHead>
                  <TableHead className="w-[13%]">Teléfono</TableHead>
                  <TableHead className="w-[17%]">Correo</TableHead>
                  <TableHead className="w-[15%]">Ocupación</TableHead>
                  <TableHead className="w-[14%]">Alumnos Asociados</TableHead>
                  <TableHead className="w-[12%] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground text-center py-6 text-sm">
                      No se encontraron apoderados registrados.
                    </TableCell>
                  </TableRow>
                )}
                {list.map((g: any) =>
                  editId === g.id ? (
                    <TableRow key={g.id} className="bg-muted/20">
                      <TableCell className="overflow-hidden">
                        <Input
                          className={cn("h-8 w-full text-xs font-semibold bg-background", editErrors.name && "border-red-500 focus-visible:ring-red-500")}
                          {...editForm.register("name")}
                        />
                        {editErrors.name?.message && (
                          <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.name.message)}</p>
                        )}
                      </TableCell>
                      <TableCell className="overflow-hidden">
                        <Input
                          className={cn("h-8 w-full font-mono text-xs bg-background", editErrors.dni && "border-red-500 focus-visible:ring-red-500")}
                          maxLength={8}
                          {...editForm.register("dni")}
                        />
                        {editErrors.dni?.message && (
                          <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.dni.message)}</p>
                        )}
                      </TableCell>
                      <TableCell className="overflow-hidden">
                        <Input
                          className={cn("h-8 w-full text-xs bg-background", editErrors.phone && "border-red-500 focus-visible:ring-red-500")}
                          placeholder="Teléfono"
                          {...editForm.register("phone")}
                        />
                        {editErrors.phone?.message && (
                          <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.phone.message)}</p>
                        )}
                      </TableCell>
                      <TableCell className="overflow-hidden">
                        <Input
                          className={cn("h-8 w-full text-xs bg-background", editErrors.email && "border-red-500 focus-visible:ring-red-500")}
                          placeholder="Correo"
                          {...editForm.register("email")}
                        />
                        {editErrors.email?.message && (
                          <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.email.message)}</p>
                        )}
                      </TableCell>
                      <TableCell className="overflow-hidden">
                        <Input
                          className={cn("h-8 w-full text-xs bg-background", editErrors.occupation && "border-red-500 focus-visible:ring-red-500")}
                          {...editForm.register("occupation")}
                        />
                        {editErrors.occupation?.message && (
                          <p className="text-red-500 text-[9px] mt-0.5 leading-none">{String(editErrors.occupation.message)}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(g.students?.length ?? 0)} alumnos
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          size="xs"
                          onClick={editForm.handleSubmit(saveEdit)}
                          disabled={updateMutation.isPending}
                          className="cursor-pointer"
                        >
                          {updateMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setEditId(null)}
                          className="cursor-pointer"
                        >
                          <X className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={g.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-foreground">{g.name}</TableCell>
                      <TableCell className="font-mono text-xs">{g.dni}</TableCell>
                      <TableCell className="text-xs font-medium">{g.phone}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{g.email || "—"}</TableCell>
                      <TableCell className="text-xs">{g.occupation || "—"}</TableCell>
                      <TableCell>
                        {g.students && g.students.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {g.students.map((s: any) => (
                              <Badge key={s.id} variant="secondary" className="text-[10px] py-0.5 justify-start w-fit">
                                {s.firstName} {s.lastName} ({s.code || "NUEVO"})
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">Ninguno</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => startEdit(g)}
                          className="cursor-pointer"
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleDelete(g)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {guardiansData?.meta && guardiansData.meta.totalPages > 1 && (
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
              Página {page} de {guardiansData.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(guardiansData.meta.totalPages, p + 1))}
              disabled={page === guardiansData.meta.totalPages}
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
