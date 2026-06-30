import * as React from "react";
import { Search, Loader2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface TariffsTableProps {
  search: string;
  setSearch: (val: string) => void;
  isLoading: boolean;
  filteredTariffs: any[];
  openEdit: (tariff: any) => void;
  deleteMutation: any;
}

export function TariffsTable({
  search,
  setSearch,
  isLoading,
  filteredTariffs,
  openEdit,
  deleteMutation,
}: TariffsTableProps) {
  return (
    <Card className="bg-card border-border/80">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Listado de Conceptos</CardTitle>
            <CardDescription>Visualiza y administra todos los montos académicos del colegio</CardDescription>
          </div>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar concepto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando tarifario...</p>
          </div>
        ) : filteredTariffs?.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Search className="size-12 text-muted-foreground mb-3" />
            <p className="text-base font-semibold">No se encontraron tarifas</p>
            <p className="text-sm text-muted-foreground">Prueba ajustando los términos de búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Concepto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nivel Académico</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTariffs?.map((tariff: any) => (
                  <TableRow key={tariff.id}>
                    <TableCell className="font-medium text-foreground">
                      {tariff.concept}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          tariff.type === "MONTHLY"
                            ? "bg-teal-500/10 text-teal-500 border-teal-500/20"
                            : tariff.type === "ONE_TIME"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }
                      >
                        {tariff.type === "MONTHLY"
                          ? "Mensual"
                          : tariff.type === "ONE_TIME"
                          ? "Único"
                          : "Extraordinario"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
                      >
                        {tariff.level === "INITIAL"
                          ? "Inicial"
                          : tariff.level === "PRIMARY"
                          ? "Primaria"
                          : "Secundaria"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      S/ {tariff.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(tariff)}
                          className="size-8 cursor-pointer"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`¿Estás seguro de eliminar el concepto "${tariff.concept}"?`)) {
                              deleteMutation.mutate({ params: { path: { id: tariff.id } } });
                            }
                          }}
                          className="size-8 text-destructive hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
