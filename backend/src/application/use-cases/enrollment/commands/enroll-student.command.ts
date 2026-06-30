import { ENROLLMENT_REPOSITORY, SECTION_REPOSITORY, STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../../domain/repositories/student.repository.interface';
import type { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import type { IEnrollmentRepository } from '../../../../domain/repositories/enrollment.repository.interface';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import { EnrollmentStatus } from '@prisma/client';
import { SectionNotFoundException, NoVacanciesAvailableException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

export class EnrollStudentCommand implements ICommand {
  constructor(
    public readonly studentId: string,
    public readonly sectionId: string,
  ) {}
}

@CommandHandler(EnrollStudentCommand)
export class EnrollStudentCommandHandler implements ICommandHandler<EnrollStudentCommand> {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    command: EnrollStudentCommand,
  ): Promise<EnrollmentEntity> {
    const student = await this.studentRepository.findById(command.studentId);
    if (!student) {
      throw new Error(`Estudiante con id ${command.studentId} no encontrado`);
    }

    const section = await this.sectionRepository.findById(command.sectionId);
    if (!section) {
      throw new SectionNotFoundException(command.sectionId);
    }

    const currentCount = section.students?.length ?? 0;
    if (currentCount >= section.capacity) {
      throw new NoVacanciesAvailableException(`${section.grade} ${section.name}`);
    }

    const updatedStudent = await this.studentRepository.update(student.id, {
      sectionId: command.sectionId,
    });

    const enrollment = await this.enrollmentRepository.create({
      studentId: updatedStudent.id,
      status: EnrollmentStatus.ACTIVE,
      year: new Date().getFullYear(),
    });

    return enrollment;
  }
}
