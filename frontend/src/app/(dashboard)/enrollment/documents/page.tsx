"use client";

import * as React from "react";
import { useEnrollmentDocuments, useEnrollmentDocumentsMutations } from "./_hooks/documents-hooks";

import { DocumentsHeader } from "./_components/header/documents-header";
import { DocumentsTable } from "./_components/table/documents-table";
import { DocumentPreview } from "./_components/detail/document-preview";

export default function DocumentosMatriculaPage() {
  // Filters & Selection
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size] = React.useState(10);

  const [selectedEnrollmentId, setSelectedEnrollmentId] = React.useState<string | null>(null);
  const [previewTipo, setPreviewTipo] = React.useState<"ficha_matricula" | "contrato_servicios">("ficha_matricula");

  const { enrollmentsData, isLoading } = useEnrollmentDocuments(page, size, search);
  const { handleReemit } = useEnrollmentDocumentsMutations();

  const list = enrollmentsData?.data ?? [];
  const selectedEnrollment = selectedEnrollmentId 
    ? list.find((e: any) => e.id === selectedEnrollmentId) 
    : null;

  const today = new Date().toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <DocumentsHeader />

      <DocumentsTable
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        page={page}
        isLoading={isLoading}
        list={list}
        enrollmentsData={enrollmentsData}
        setSelectedEnrollmentId={setSelectedEnrollmentId}
        setPreviewTipo={setPreviewTipo}
        handleReemit={handleReemit}
      />

      <DocumentPreview
        selectedEnrollmentId={selectedEnrollmentId}
        setSelectedEnrollmentId={setSelectedEnrollmentId}
        selectedEnrollment={selectedEnrollment}
        previewTipo={previewTipo}
        setPreviewTipo={setPreviewTipo}
        handlePrint={handlePrint}
        today={today}
      />
    </div>
  );
}
