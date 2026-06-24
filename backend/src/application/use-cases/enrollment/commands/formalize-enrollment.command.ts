import { ENROLLMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { GUARDIAN_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { PAYMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_INTERACTION_REPOSITORY } from '../../../../config/constants/tokens';
import { EVALUATION_RESULT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../../domain/repositories/student.repository.interface';
import type { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import type { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import type { IEnrollmentRepository } from '../../../../domain/repositories/enrollment.repository.interface';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import { EducationalLevel, EnrollmentStatus } from '@prisma/client';
import {
  SectionNotFoundException,
  NoVacanciesAvailableException,
  DeudaPendienteException,
  StudentAlreadyExistsException,
} from '../../../../domain/exceptions/enrollment-domain.exceptions';

export class FormalizeEnrollmentCommand implements ICommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dni: string,
    public readonly level: EducationalLevel,
    public readonly grade: string,
    public readonly sectionId: string,
    public readonly guardianDni: string,
    public readonly guardianName: string,
    public readonly guardianPhone: string,
    public readonly guardianEmail?: string | null,
    public readonly guardianOccupation?: string | null,
  ) {}
}

@CommandHandler(FormalizeEnrollmentCommand)
export class FormalizeEnrollmentCommandHandler implements ICommandHandler<FormalizeEnrollmentCommand> {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(GUARDIAN_REPOSITORY)
    private readonly guardianRepository: IGuardianRepository,
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    command: FormalizeEnrollmentCommand,
  ): Promise<EnrollmentEntity> {
    // 1. Validar la sección asignada y sus vacantes
    const section = await this.sectionRepository.findById(command.sectionId);
    if (!section) {
      throw new SectionNotFoundException(command.sectionId);
    }

    const currentCount = section.students?.length ?? 0;
    if (currentCount >= section.capacity) {
      throw new NoVacanciesAvailableException(
        `${section.grade} ${section.name}`,
      );
    }

    // 2. Validar que el estudiante no exista por DNI
    const existingStudent = await this.studentRepository.findByDni(command.dni);
    if (existingStudent) {
      throw new StudentAlreadyExistsException(command.dni);
    }

    // 3. Validar deudas del apoderado
    // Regla de negocio: Si el DNI termina en "99", simulamos que tiene deuda pendiente de años anteriores
    if (command.guardianDni.endsWith('99')) {
      throw new DeudaPendienteException(command.guardianName);
    }

    // 4. Buscar o crear el apoderado
    let guardian = await this.guardianRepository.findByDni(command.guardianDni);
    if (!guardian) {
      guardian = await this.guardianRepository.create({
        dni: command.guardianDni,
        name: command.guardianName,
        phone: command.guardianPhone,
        email: command.guardianEmail,
        occupation: command.guardianOccupation,
      });
    }

    // 5. Crear el estudiante asignando código único
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `ALU-${year}-${randomNum}`;

    const student = await this.studentRepository.create({
      code,
      firstName: command.firstName,
      lastName: command.lastName,
      dni: command.dni,
      level: command.level,
      grade: command.grade,
      sectionId: command.sectionId,
      guardianId: guardian.id,
    });

    // 6. Generar e inscribir la matrícula activa
    const pdfUrl = `/pdf/ficha-matricula-${student.id}.pdf`;
    const enrollment = await this.enrollmentRepository.create({
      studentId: student.id,
      year,
      status: EnrollmentStatus.ACTIVE,
      pdfUrl,
    });

    return enrollment;
  }
}
