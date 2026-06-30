export interface DocumentChecklist {
  dni_alumno: boolean;
  partida_nacimiento: boolean;
  dni_padres: boolean;
  libreta_notas: boolean;
  certificado_conducta: boolean;
}

export type ProspectDocumentsState = Record<string, DocumentChecklist>;
