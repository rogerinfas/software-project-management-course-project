import { DomainException } from './domain-exception';

export class GuardianNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Apoderado con ID o DNI ${id} no encontrado`, 'GUARDIAN_NOT_FOUND');
  }
}

export class StudentNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Estudiante con ID o DNI ${id} no encontrado`, 'STUDENT_NOT_FOUND');
  }
}

export class SectionNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Sección con ID ${id} no encontrada`, 'SECTION_NOT_FOUND');
  }
}

export class NoVacanciesAvailableException extends DomainException {
  constructor(sectionName: string) {
    super(`No quedan vacantes disponibles en la sección ${sectionName}`, 'NO_VACANCIES_AVAILABLE');
  }
}

export class DeudaPendienteException extends DomainException {
  constructor(guardianName: string) {
    super(`El apoderado ${guardianName} registra deudas pendientes de años anteriores. Matrícula bloqueada.`, 'GUARDIAN_HAS_DEBT');
  }
}

export class GuardianAlreadyExistsException extends DomainException {
  constructor(dni: string) {
    super(`Ya existe un apoderado registrado con el DNI ${dni}`, 'GUARDIAN_ALREADY_EXISTS');
  }
}

export class StudentAlreadyExistsException extends DomainException {
  constructor(dni: string) {
    super(`Ya existe un estudiante registrado con el DNI ${dni}`, 'STUDENT_ALREADY_EXISTS');
  }
}
