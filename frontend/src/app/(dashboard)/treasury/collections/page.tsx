"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bulkSchema, singleSchema, paymentSchema } from "./_schemas/collections.schema";
import { BulkFormValues, PaymentFormValues, SingleFormValues } from "./_types/collections.types";
import { useCollectionsData, useCollectionsMutations } from "./_hooks/collections-hooks";
import { CollectionsHeader } from "./_components/header/collections-header";
import { CollectionsKpi } from "./_components/stats/collections-kpi";
import { CollectionsTable } from "./_components/table/collections-table";
import { CollectionsDialogs } from "./_components/create/collections-dialogs";

export default function CollectionsPage() {
  // Filter states
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "PENDING" | "PARTIAL" | "PAID">("ALL");

  // Dialog states
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [singleOpen, setSingleOpen] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [payCharge, setPayCharge] = React.useState<any>(null);

  // React Hook Form setup
  const bulkForm = useForm<BulkFormValues>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { tariffId: "", dueDate: "" },
  });

  const singleForm = useForm<SingleFormValues>({
    resolver: zodResolver(singleSchema),
    defaultValues: { studentId: "", tariffId: "", dueDate: "" },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: "", method: "CASH" },
  });

  // Queries & Mutations
  const { charges, loadingCharges, tariffs, students } = useCollectionsData();
  const {
    generateBulkMutation,
    createSingleMutation,
    deleteChargeMutation,
    registerPaymentMutation
  } = useCollectionsMutations(
    bulkForm, singleForm, paymentForm, setBulkOpen, setSingleOpen, setPayOpen, setPayCharge
  );

  // Computations
  const filteredCharges = charges?.filter((c: any) => {
    const matchesSearch =
      c.student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      c.student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      c.student?.dni?.includes(search) ||
      c.tariff?.concept?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = charges?.reduce((acc: number, curr: any) => acc + curr.pendingAmount, 0) || 0;
  const overdueCharges = charges?.filter((c: any) => c.status !== "PAID" && c.dueDate && new Date(c.dueDate) < new Date()).length || 0;
  const paidAmount = charges?.reduce((acc: number, curr: any) => acc + (curr.originalAmount - curr.pendingAmount), 0) || 0;
  const totalAmount = charges?.reduce((acc: number, curr: any) => acc + curr.originalAmount, 0) || 1;
  const collectionPercentage = Number(((paidAmount / totalAmount) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      <CollectionsHeader setSingleOpen={setSingleOpen} setBulkOpen={setBulkOpen} />

      <CollectionsKpi
        totalOutstanding={totalOutstanding}
        overdueCharges={overdueCharges}
        paidAmount={paidAmount}
        collectionPercentage={collectionPercentage}
      />

      <CollectionsTable
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
        loadingCharges={loadingCharges}
        filteredCharges={filteredCharges || []}
        setPayCharge={setPayCharge}
        setPayOpen={setPayOpen}
        paymentForm={paymentForm}
        deleteChargeMutation={deleteChargeMutation}
      />

      <CollectionsDialogs
        bulkOpen={bulkOpen}
        setBulkOpen={setBulkOpen}
        singleOpen={singleOpen}
        setSingleOpen={setSingleOpen}
        payOpen={payOpen}
        setPayOpen={setPayOpen}
        bulkForm={bulkForm}
        singleForm={singleForm}
        paymentForm={paymentForm}
        payCharge={payCharge}
        tariffs={tariffs || []}
        students={students || []}
        generateBulkMutation={generateBulkMutation}
        createSingleMutation={createSingleMutation}
        registerPaymentMutation={registerPaymentMutation}
      />
    </div>
  );
}
