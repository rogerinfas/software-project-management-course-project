import { DomainException } from './domain-exception';

export class CourseNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Curso con ID ${id} no encontrado`, 'COURSE_NOT_FOUND');
  }
}

export class CourseAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Ya existe un curso registrado con el nombre "${name}"`, 'COURSE_ALREADY_EXISTS');
  }
}

export class ScheduleNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Horario con ID ${id} no encontrado`, 'SCHEDULE_NOT_FOUND');
  }
}

export class ScheduleConflictException extends DomainException {
  constructor(message: string) {
    super(message, 'SCHEDULE_CONFLICT');
  }
}

export class CommunicationNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Comunicado con ID ${id} no encontrado`, 'COMMUNICATION_NOT_FOUND');
  }
}

export class TeacherNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Docente con ID de perfil de personal ${id} no encontrado`, 'TEACHER_NOT_FOUND');
  }
}
