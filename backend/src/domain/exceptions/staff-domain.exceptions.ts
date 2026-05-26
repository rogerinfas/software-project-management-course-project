import { DomainException } from './domain-exception';

export class StaffProfileNotFoundException extends DomainException {
  constructor(idOrUserId: string) {
    super(`Perfil de personal con ID o ID de usuario ${idOrUserId} no encontrado`, 'STAFF_PROFILE_NOT_FOUND');
  }
}

export class DuplicateStaffProfileException extends DomainException {
  constructor(userId: string) {
    super(`El usuario con ID ${userId} ya cuenta con un perfil de personal asignado`, 'DUPLICATE_STAFF_PROFILE');
  }
}

export class AttendanceRecordNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Registro de asistencia con ID ${id} no encontrado`, 'ATTENDANCE_RECORD_NOT_FOUND');
  }
}

export class AttendanceRuleNotFoundException extends DomainException {
  constructor() {
    super('No se encontró ninguna regla global de asistencia configurada', 'ATTENDANCE_RULE_NOT_FOUND');
  }
}
