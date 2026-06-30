"use client";

import * as React from "react";
import { useReceiptsData } from "./_hooks/receipts-hooks";
import { ReceiptsHeader } from "./_components/header/receipts-header";
import { ReceiptsKpi } from "./_components/stats/receipts-kpi";
import { ReceiptsTable } from "./_components/table/receipts-table";
import { ReceiptsDialog } from "./_components/detail/receipts-dialog";

export default function ReceiptsPage() {
  const [search, setSearch] = React.useState("");
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);

  const { payments, isLoading } = useReceiptsData();

  const filteredPayments = payments?.filter((p: any) => {
    const stdName = `${p.charge?.student?.firstName || ""} ${p.charge?.student?.lastName || ""}`.toLowerCase();
    const concept = (p.charge?.tariff?.concept || "").toLowerCase();
    const searchVal = search.toLowerCase();

    return stdName.includes(searchVal) || concept.includes(searchVal) || p.id.includes(searchVal);
  });

  const totalCollectedSum = payments?.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0) || 0;
  const cashPaymentsCount = payments?.filter((p: any) => p.method === "CASH").length || 0;
  const bankPaymentsCount = payments?.filter((p: any) => p.method === "TRANSFER").length || 0;
  const cardPaymentsCount = payments?.filter((p: any) => p.method === "CARD").length || 0;

  return (
    <div className="space-y-6">
      <ReceiptsHeader />

      <ReceiptsKpi
        totalCollectedSum={totalCollectedSum}
        cashPaymentsCount={cashPaymentsCount}
        bankPaymentsCount={bankPaymentsCount}
        cardPaymentsCount={cardPaymentsCount}
      />

      <ReceiptsTable
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        filteredPayments={filteredPayments || []}
        setSelectedPayment={setSelectedPayment}
        setInvoiceOpen={setInvoiceOpen}
      />

      <ReceiptsDialog
        invoiceOpen={invoiceOpen}
        setInvoiceOpen={setInvoiceOpen}
        selectedPayment={selectedPayment}
      />
    </div>
  );
}
