"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useFamilyRecordsStudents, useFamilyRecordsMutations } from "./_hooks/family-records-hooks";
import { FamilyRecordsHeader } from "./_components/header/family-records-header";
import { StudentSelector } from "./_components/student-selector";
import { StudentTabs } from "./_components/student-tabs";

export default function ExpedientePage() {
  const [studentId, setStudentId] = React.useState("");
  
  // Inline edit state
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editDni, setEditDni] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [editTel, setEditTel] = React.useState("");
  const [editCorreo, setEditCorreo] = React.useState("");
  const [editOcup, setEditOcup] = React.useState("");

  const { students, isLoadingStudents } = useFamilyRecordsStudents();
  const { updateMutation } = useFamilyRecordsMutations(() => setEditId(null));

  // Automatically select first student if none selected
  React.useEffect(() => {
    if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [students, studentId]);

  const activeStudent = students.find((s: any) => s.id === studentId) as any;

  // Siblings: Students who share the exact same guardian
  const siblings = activeStudent && activeStudent.guardianId
    ? students.filter((s: any) => s.guardianId === activeStudent.guardianId && s.id !== activeStudent.id)
    : [];

  return (
    <div className="space-y-6">
      <FamilyRecordsHeader />

      {isLoadingStudents ? (
        <div className="flex h-60 flex-col items-center justify-center gap-3">
          <Loader2 className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">Cargando alumnos matriculados...</p>
        </div>
      ) : (
        <>
          <StudentSelector 
            students={students}
            studentId={studentId}
            setStudentId={setStudentId}
            setEditId={setEditId}
          />

          {activeStudent && (
            <StudentTabs 
              activeStudent={activeStudent}
              siblings={siblings}
              editId={editId}
              setEditId={setEditId}
              editDni={editDni}
              setEditDni={setEditDni}
              editName={editName}
              setEditName={setEditName}
              editTel={editTel}
              setEditTel={setEditTel}
              editCorreo={editCorreo}
              setEditCorreo={setEditCorreo}
              editOcup={editOcup}
              setEditOcup={setEditOcup}
              updateMutation={updateMutation}
            />
          )}
        </>
      )}
    </div>
  );
}
