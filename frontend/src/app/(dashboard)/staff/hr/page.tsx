"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { UserPlus, Pencil, Trash2, ShieldAlert, Award, Briefcase, Clock, FileText, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backend } from "@/lib/api/types/backend";

const hrSchema = z.object({
  userId: z.string().optional(),
  specialty: z.string().min(2, "La especialidad debe tener al menos 2 caracteres"),
  cvUrl: z.string().url("CV URL debe ser una URL válida").or(z.literal("")),
  entryTime: z.string().min(1, "Hora de entrada es requerida"),
  exitTime: z.string().min(1, "Hora de salida es requerida"),
  gracePeriod: z.string().min(1, "Tiempo de tolerancia es requerido").refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
    message: "Tolerancia inválida (debe ser mayor o igual a 0)",
  }),
});

export default function HrPage() {
  const queryClient = useQueryClient();

  // Search filter
  const [search, setSearch] = React.useState("");

  // Dialog states
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  // React Hook Form for creation
  const createForm = useForm({
    resolver: zodResolver(hrSchema),
    defaultValues: {
      userId: "",
      specialty: "",
      cvUrl: "",
      entryTime: "08:00",
      exitTime: "16:00",
      gracePeriod: "5",
    },
  });
  const { formState: { errors: createErrors } } = createForm;

  const selectedUserId = createForm.watch("userId");
  const specialty = createForm.watch("specialty");
  const cvUrl = createForm.watch("cvUrl");
  const entryTime = createForm.watch("entryTime");
  const exitTime = createForm.watch("exitTime");
  const gracePeriod = createForm.watch("gracePeriod");

  // React Hook Form for edit
  const editForm = useForm({
    resolver: zodResolver(hrSchema),
    defaultValues: {
      specialty: "",
      cvUrl: "",
      entryTime: "08:00",
      exitTime: "16:00",
      gracePeriod: "5",
    },
  });
  const { formState: { errors: editErrors } } = editForm;

  const editSpecialty = editForm.watch("specialty");
  const editCvUrl = editForm.watch("cvUrl");
  const editEntryTime = editForm.watch("entryTime");
  const editExitTime = editForm.watch("exitTime");
  const editGracePeriod = editForm.watch("gracePeriod");

  // Edit profile state
  const [editId, setEditId] = React.useState<string | null>(null);

  // Queries
  const { data: staffList, isLoading: loadingStaff } = backend.useQuery(
    "get",
    "/api/staff/profiles",
    { params: { query: {} as any } }
  );

  const { data: usersResponse, isLoading: loadingUsers } = backend.useQuery(
    "get",
    "/api/users",
    { params: { query: { page: 1, size: 100 } } }
  );

  // Mutations
  const createMutation = backend.useMutation("post", "/api/staff/profiles", {
    onSuccess: () => {
      toast.success("Perfil de personal creado con éxito");
      createForm.reset();
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/staff/profiles"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const updateMutation = backend.useMutation("put", "/api/staff/profiles/{id}", {
    onSuccess: () => {
      toast.success("Perfil de personal actualizado con éxito");
      setEditOpen(false);
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["get", "/api/staff/profiles"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  const deleteMutation = backend.useMutation("delete", "/api/staff/profiles/{id}", {
    onSuccess: () => {
      toast.success("Perfil de personal eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["get", "/api/staff/profiles"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error interno del servidor");
    },
  });

  // Filter users to display in dropdown (those not already assigned to staff profile)
  const availableUsers = React.useMemo(() => {
    if (!usersResponse?.data || !staffList) return [];
    const assignedUserIds = new Set(staffList.map((s: any) => s.userId));
    return usersResponse.data.filter(
      (user: any) => (user.role === "TEACHER" || user.role === "STAFF" || user.role === "ADMIN") && !assignedUserIds.has(user.id)
    );
  }, [usersResponse, staffList]);

  // Metrics calculations
  const metrics = React.useMemo(() => {
    if (!staffList) return { total: 0, teachers: 0, staff: 0, avgGrace: 0 };
    const total = staffList.length;
    const teachers = staffList.filter((s: any) => s.user?.role === "TEACHER").length;
    const staff = staffList.filter((s: any) => s.user?.role === "STAFF" || s.user?.role === "ADMIN").length;
    const avgGrace = total > 0 ? Math.round(staffList.reduce((acc: number, s: any) => acc + s.gracePeriod, 0) / total) : 0;
    return { total, teachers, staff, avgGrace };
  }, [staffList]);

  // Search filter implementation
  const filteredStaff = React.useMemo(() => {
    if (!staffList) return [];
    return staffList.filter((s: any) => {
      const matchName = s.user?.name?.toLowerCase().includes(search.toLowerCase());
      const matchSpec = s.specialty?.toLowerCase().includes(search.toLowerCase());
      const matchEmail = s.user?.email?.toLowerCase().includes(search.toLowerCase());
      return matchName || matchSpec || matchEmail;
    });
  }, [staffList, search]);

  const handleEditClick = (staff: any) => {
    setEditId(staff.id);
    editForm.reset({
      specialty: staff.specialty,
      cvUrl: staff.cvUrl || "",
      entryTime: staff.entryTime,
      exitTime: staff.exitTime,
      gracePeriod: String(staff.gracePeriod),
    });
    setEditOpen(true);
  };

  const handleCreateSubmit = (data: any) => {
    if (!data.userId || !data.specialty) {
      toast.error("Por favor, rellene todos los campos obligatorios");
      return;
    }
    createMutation.mutate({
      body: {
        userId: data.userId,
        specialty: data.specialty,
        cvUrl: data.cvUrl || undefined,
        entryTime: data.entryTime,
        exitTime: data.exitTime,
        gracePeriod: parseInt(data.gracePeriod, 10),
      },
    });
  };

  const handleEditSubmit = (data: any) => {
    if (!editId || !data.specialty) {
      toast.error("Por favor, rellene todos los campos obligatorios");
      return;
    }
    updateMutation.mutate({
      params: { path: { id: editId } },
      body: {
        specialty: data.specialty,
        cvUrl: data.cvUrl || undefined,
        entryTime: data.entryTime,
        exitTime: data.exitTime,
        gracePeriod: parseInt(data.gracePeriod, 10),
      },
    });
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("¿Está seguro de eliminar este perfil de personal? Las marcaciones pasadas y horarios asociados se verán afectados.")) {
      deleteMutation.mutate({ params: { path: { id } } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Módulo 5 · Gestión de Recursos Humanos (RRHH)</h1>
          <p className="text-muted-foreground text-sm">
            Administración del personal docente y administrativo, asignación de horarios de entrada, salida y tolerancias.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="size-4" />
          Registrar Personal
        </Button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Total</p>
              <h3 className="text-2xl font-bold">{metrics.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Briefcase className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Docentes Activos</p>
              <h3 className="text-2xl font-bold text-primary">{metrics.teachers}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administrativos</p>
              <h3 className="text-2xl font-bold">{metrics.staff}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/80">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tolerancia Promedio</p>
              <h3 className="text-2xl font-bold text-primary">{metrics.avgGrace} min</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Historial */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/80">
        <CardHeader className="pb-4 border-b border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Expediente de Contratos y Perfiles</CardTitle>
            <CardDescription>
              Lista interactiva de empleados con privilegios académicos, horarios y tolerancia asignada.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o cargo..."
              className="pl-9 bg-background/50 border-border/40 rounded-xl text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          {loadingStaff ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              Cargando base de datos de RRHH...
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No se encontraron perfiles de personal en esta búsqueda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="font-semibold text-xs">Nombre Completo</TableHead>
                  <TableHead className="font-semibold text-xs">Cargo / Especialidad</TableHead>
                  <TableHead className="font-semibold text-xs">Rol Sistema</TableHead>
                  <TableHead className="font-semibold text-xs">Horario Asignado</TableHead>
                  <TableHead className="font-semibold text-xs">Tolerancia</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff: any) => (
                  <TableRow key={staff.id} className="border-border/30 hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="text-sm font-bold">{staff.user?.name || "Sin Nombre"}</p>
                        <p className="text-[10px] text-muted-foreground">{staff.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold">{staff.specialty}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 ${
                          staff.user?.role === "TEACHER"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }`}
                      >
                        {staff.user?.role === "TEACHER" ? "Docente" : "Administrativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">
                      {staff.entryTime} - {staff.exitTime}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      <span className="text-amber-500 font-bold">{staff.gracePeriod} min</span> de gracia
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(staff)}
                          className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(staff.id)}
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo Registrar Personal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border/40 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" />
              Registrar Perfil de Personal
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", createErrors.userId && "text-red-500")}>Asignar a Usuario Registrado</Label>
              <Select value={selectedUserId} onValueChange={(val) => {
                createForm.setValue("userId", val || "");
                createForm.clearErrors("userId");
              }}>
                <SelectTrigger className={cn("bg-background/50 border-border/40", createErrors.userId && "border-red-500 focus:ring-red-500")}>
                  <SelectValue placeholder="Seleccione un usuario de la lista..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>Cargando lista de usuarios...</SelectItem>
                  ) : availableUsers.length === 0 ? (
                    <SelectItem value="empty" disabled>No hay usuarios de rol administrativo/docente sin perfil</SelectItem>
                  ) : (
                    availableUsers.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email}) - Role: {user.role}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {createErrors.userId?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(createErrors.userId.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", createErrors.specialty && "text-red-500")}>Especialidad / Cargo</Label>
              <Input
                placeholder="Ej. Docente de Ciencias, Asistente Contable"
                className={cn("bg-background/50 border-border/40", createErrors.specialty && "border-red-500 focus-visible:ring-red-500")}
                {...createForm.register("specialty")}
              />
              {createErrors.specialty?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(createErrors.specialty.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", createErrors.cvUrl && "text-red-500")}>URL Expediente CV (Opcional)</Label>
              <Input
                placeholder="https://drive.google.com/..."
                className={cn("bg-background/50 border-border/40", createErrors.cvUrl && "border-red-500 focus-visible:ring-red-500")}
                {...createForm.register("cvUrl")}
              />
              {createErrors.cvUrl?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(createErrors.cvUrl.message)}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", createErrors.entryTime && "text-red-500")}>Entrada (HH:mm)</Label>
                <Input
                  className={cn("bg-background/50 border-border/40", createErrors.entryTime && "border-red-500 focus-visible:ring-red-500")}
                  {...createForm.register("entryTime")}
                />
                {createErrors.entryTime?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.entryTime.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", createErrors.exitTime && "text-red-500")}>Salida (HH:mm)</Label>
                <Input
                  className={cn("bg-background/50 border-border/40", createErrors.exitTime && "border-red-500 focus-visible:ring-red-500")}
                  {...createForm.register("exitTime")}
                />
                {createErrors.exitTime?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.exitTime.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", createErrors.gracePeriod && "text-red-500")}>Gracia (min)</Label>
                <Input
                  type="number"
                  className={cn("bg-background/50 border-border/40", createErrors.gracePeriod && "border-red-500 focus-visible:ring-red-500")}
                  {...createForm.register("gracePeriod")}
                />
                {createErrors.gracePeriod?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(createErrors.gracePeriod.message)}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !selectedUserId || !specialty}
                className="cursor-pointer"
              >
                {createMutation.isPending ? "Registrando..." : "Guardar Perfil"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo Editar Personal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Editar Perfil de Personal
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", editErrors.specialty && "text-red-500")}>Especialidad / Cargo</Label>
              <Input
                {...editForm.register("specialty")}
                className={cn(editErrors.specialty && "border-red-500 focus-visible:ring-red-500")}
              />
              {editErrors.specialty?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(editErrors.specialty.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", editErrors.cvUrl && "text-red-500")}>URL Expediente CV (Opcional)</Label>
              <Input
                placeholder="https://drive.google.com/..."
                {...editForm.register("cvUrl")}
                className={cn(editErrors.cvUrl && "border-red-500 focus-visible:ring-red-500")}
              />
              {editErrors.cvUrl?.message && (
                <p className="text-red-500 text-xs mt-0.5">{String(editErrors.cvUrl.message)}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", editErrors.entryTime && "text-red-500")}>Entrada (HH:mm)</Label>
                <Input
                  {...editForm.register("entryTime")}
                  className={cn(editErrors.entryTime && "border-red-500 focus-visible:ring-red-500")}
                />
                {editErrors.entryTime?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(editErrors.entryTime.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", editErrors.exitTime && "text-red-500")}>Salida (HH:mm)</Label>
                <Input
                  {...editForm.register("exitTime")}
                  className={cn(editErrors.exitTime && "border-red-500 focus-visible:ring-red-500")}
                />
                {editErrors.exitTime?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(editErrors.exitTime.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", editErrors.gracePeriod && "text-red-500")}>Gracia (min)</Label>
                <Input
                  type="number"
                  {...editForm.register("gracePeriod")}
                  className={cn(editErrors.gracePeriod && "border-red-500 focus-visible:ring-red-500")}
                />
                {editErrors.gracePeriod?.message && (
                  <p className="text-red-500 text-xs mt-0.5">{String(editErrors.gracePeriod.message)}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !editSpecialty}
                className="cursor-pointer"
              >
                {updateMutation.isPending ? "Guardando..." : "Actualizar Perfil"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
