import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BulkFormValues, PaymentFormValues, SingleFormValues } from "../../_types/collections.types";

interface CollectionsDialogsProps {
  bulkOpen: boolean;
  setBulkOpen: (val: boolean) => void;
  singleOpen: boolean;
  setSingleOpen: (val: boolean) => void;
  payOpen: boolean;
  setPayOpen: (val: boolean) => void;
  bulkForm: UseFormReturn<BulkFormValues>;
  singleForm: UseFormReturn<SingleFormValues>;
  paymentForm: UseFormReturn<PaymentFormValues>;
  payCharge: any;
  tariffs: any[];
  students: any[];
  generateBulkMutation: any;
  createSingleMutation: any;
  registerPaymentMutation: any;
}

export function CollectionsDialogs({
  bulkOpen,
  setBulkOpen,
  singleOpen,
  setSingleOpen,
  payOpen,
  setPayOpen,
  bulkForm,
  singleForm,
  paymentForm,
  payCharge,
  tariffs,
  students,
  generateBulkMutation,
  createSingleMutation,
  registerPaymentMutation,
}: CollectionsDialogsProps) {
  const { formState: { errors: bulkErrors } } = bulkForm;
  const { formState: { errors: singleErrors } } = singleForm;
  const { formState: { errors: paymentErrors } } = paymentForm;

  const handleBulkSubmit = (data: BulkFormValues) => {
    if (!data.tariffId) {
      toast.error("Selecciona un concepto tarifario");
      return;
    }
    generateBulkMutation.mutate({
      body: {
        tariffId: data.tariffId,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      },
    });
  };

  const handleSingleSubmit = (data: SingleFormValues) => {
    if (!data.studentId || !data.tariffId) {
      toast.error("Selecciona estudiante y concepto tarifario");
      return;
    }
    createSingleMutation.mutate({
      body: {
        studentId: data.studentId,
        tariffId: data.tariffId,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      },
    });
  };

  const handlePaymentSubmit = (data: PaymentFormValues) => {
    if (!payCharge || !data.amount) return;
    registerPaymentMutation.mutate({
      body: {
        chargeId: payCharge.id,
        amount: parseFloat(data.amount),
        method: data.method,
      },
    });
  };

  return (
    <>
      {/* Bulk Charges Dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Generación de Cargos Masivos</DialogTitle>
          </DialogHeader>
          <form onSubmit={bulkForm.handleSubmit(handleBulkSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className={cn(bulkErrors.tariffId && "text-red-500")}>Concepto Tarifario a Cobrar</Label>
              <Select value={bulkForm.watch("tariffId")} onValueChange={(val) => {
                bulkForm.setValue("tariffId", val || "");
                bulkForm.clearErrors("tariffId");
              }}>
                <SelectTrigger className={cn("h-9", bulkErrors.tariffId && "border-red-500 focus:ring-red-500")}>
                  <SelectValue placeholder="Selecciona una tarifa" />
                </SelectTrigger>
                <SelectContent>
                  {tariffs?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.concept} (S/ {t.amount.toFixed(2)}) - {t.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bulkErrors.tariffId?.message && (
                <p className="text-red-500 text-xs mt-1">{String(bulkErrors.tariffId.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-due-date" className={cn(bulkErrors.dueDate && "text-red-500")}>Fecha de Vencimiento</Label>
              <Input
                id="bulk-due-date"
                type="date"
                {...bulkForm.register("dueDate")}
                className={cn("h-9", bulkErrors.dueDate && "border-red-500 focus-visible:ring-red-500")}
              />
              {bulkErrors.dueDate?.message && (
                <p className="text-red-500 text-xs mt-1">{String(bulkErrors.dueDate.message)}</p>
              )}
            </div>
            <div className="p-3 bg-muted border border-border rounded-xl text-xs text-muted-foreground leading-relaxed">
              <strong>Nota Importante:</strong> Se generará un cargo financiero individual para todos los estudiantes matriculados en el nivel académico correspondiente al concepto seleccionado.
            </div>
            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBulkOpen(false)}
                className="h-9 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={generateBulkMutation.isPending}
                className="h-9 font-semibold cursor-pointer"
              >
                {generateBulkMutation.isPending ? "Generando..." : "Generar Cargos Masivos"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Individual Charge Dialog */}
      <Dialog open={singleOpen} onOpenChange={setSingleOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Generar Cargo Individual</DialogTitle>
          </DialogHeader>
          <form onSubmit={singleForm.handleSubmit(handleSingleSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className={cn(singleErrors.studentId && "text-red-500")}>Selecciona Alumno</Label>
              <Select value={singleForm.watch("studentId")} onValueChange={(val) => {
                singleForm.setValue("studentId", val || "");
                singleForm.clearErrors("studentId");
              }}>
                <SelectTrigger className={cn("h-9", singleErrors.studentId && "border-red-500 focus:ring-red-500")}>
                  <SelectValue placeholder="Buscar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((std: any) => (
                    <SelectItem key={std.id} value={std.id}>
                      {std.firstName} {std.lastName} - DNI: {std.dni} ({std.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {singleErrors.studentId?.message && (
                <p className="text-red-500 text-xs mt-1">{String(singleErrors.studentId.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className={cn(singleErrors.tariffId && "text-red-500")}>Concepto Tarifario</Label>
              <Select value={singleForm.watch("tariffId")} onValueChange={(val) => {
                singleForm.setValue("tariffId", val || "");
                singleForm.clearErrors("tariffId");
              }}>
                <SelectTrigger className={cn("h-9", singleErrors.tariffId && "border-red-500 focus:ring-red-500")}>
                  <SelectValue placeholder="Concepto de cobro" />
                </SelectTrigger>
                <SelectContent>
                  {tariffs?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.concept} (S/ {t.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {singleErrors.tariffId?.message && (
                <p className="text-red-500 text-xs mt-1">{String(singleErrors.tariffId.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="single-due-date" className={cn(singleErrors.dueDate && "text-red-500")}>Fecha de Vencimiento</Label>
              <Input
                id="single-due-date"
                type="date"
                {...singleForm.register("dueDate")}
                className={cn("h-9", singleErrors.dueDate && "border-red-500 focus-visible:ring-red-500")}
              />
              {singleErrors.dueDate?.message && (
                <p className="text-red-500 text-xs mt-1">{String(singleErrors.dueDate.message)}</p>
              )}
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSingleOpen(false)}
                className="h-9 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createSingleMutation.isPending}
                className="h-9 font-semibold cursor-pointer"
              >
                {createSingleMutation.isPending ? "Generando..." : "Asignar Cargo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Payment Inline Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Registrar Cobro de Caja</DialogTitle>
          </DialogHeader>
          {payCharge && (
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4 pt-2">
              <div className="p-4 bg-muted rounded-xl space-y-2 text-sm border border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estudiante:</span>
                  <span className="font-semibold">{payCharge.student?.firstName} {payCharge.student?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concepto:</span>
                  <span className="font-semibold">{payCharge.tariff?.concept}</span>
                </div>
                <div className="flex justify-between border-t border-border/80 pt-2 mt-2">
                  <span className="text-muted-foreground">Saldo Pendiente:</span>
                  <span className="font-extrabold text-primary tabular-nums">S/ {payCharge.pendingAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay-amount" className={cn(paymentErrors.amount && "text-red-500")}>Monto Recibido (S/)</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  step="0.01"
                  max={payCharge.pendingAmount}
                  {...paymentForm.register("amount")}
                  className={cn("h-9", paymentErrors.amount && "border-red-500 focus-visible:ring-red-500")}
                />
                {paymentErrors.amount?.message && (
                  <p className="text-red-500 text-xs mt-1">{String(paymentErrors.amount.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={cn(paymentErrors.method && "text-red-500")}>Método de Pago</Label>
                <Select value={paymentForm.watch("method")} onValueChange={(val: any) => {
                  paymentForm.setValue("method", val || "CASH");
                  paymentForm.clearErrors("method");
                }}>
                  <SelectTrigger className={cn("h-9", paymentErrors.method && "border-red-500 focus:ring-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="CARD">Tarjeta de Débito / Crédito</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia Bancaria / Yape</SelectItem>
                  </SelectContent>
                </Select>
                {paymentErrors.method?.message && (
                  <p className="text-red-500 text-xs mt-1">{String(paymentErrors.method.message)}</p>
                )}
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPayOpen(false)}
                  className="h-9 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={registerPaymentMutation.isPending}
                  className="h-9 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {registerPaymentMutation.isPending ? "Procesando..." : "Confirmar Cobro"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
