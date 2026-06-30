import { GUARDIAN_REPOSITORY, STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../../domain/repositories/student.repository.interface';
import type { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';

export class AssignGuardianToStudentCommand implements ICommand {
  constructor(
    public readonly studentId: string,
    public readonly guardianDni: string,
    public readonly guardianName: string,
    public readonly guardianPhone: string,
    public readonly guardianEmail?: string | null,
    public readonly guardianOccupation?: string | null,
  ) {}
}

@CommandHandler(AssignGuardianToStudentCommand)
export class AssignGuardianToStudentCommandHandler implements ICommandHandler<AssignGuardianToStudentCommand> {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(GUARDIAN_REPOSITORY)
    private readonly guardianRepository: IGuardianRepository,
  ) {}

  async execute(
    command: AssignGuardianToStudentCommand,
  ): Promise<GuardianEntity> {
    const student = await this.studentRepository.findById(command.studentId);
    if (!student) {
      throw new Error(`Estudiante con id ${command.studentId} no encontrado`);
    }

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

    await this.studentRepository.update(student.id, {
      guardianId: guardian.id,
    });

    return guardian;
  }
}
