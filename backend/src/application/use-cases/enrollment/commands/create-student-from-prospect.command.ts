import { PROSPECT_REPOSITORY, STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../../domain/repositories/student.repository.interface';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { StudentEntity } from '../../../../domain/entities/student.entity';
import { EducationalLevel } from '@prisma/client';

export class CreateStudentFromProspectCommand implements ICommand {
  constructor(
    public readonly prospectId: string,
    public readonly dni: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly level: EducationalLevel,
    public readonly grade: string,
  ) {}
}

@CommandHandler(CreateStudentFromProspectCommand)
export class CreateStudentFromProspectCommandHandler implements ICommandHandler<CreateStudentFromProspectCommand> {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(
    command: CreateStudentFromProspectCommand,
  ): Promise<StudentEntity> {
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      throw new Error(`Prospect con id ${command.prospectId} no encontrado`);
    }

    const existingStudent = await this.studentRepository.findByDni(command.dni);
    if (existingStudent) {
      throw new Error(`Estudiante con DNI ${command.dni} ya existe`);
    }

    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `ALU-${year}-${randomNum}`;

    const student = await this.studentRepository.create({
      code,
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      level: command.level,
      grade: command.grade,
      prospectId: command.prospectId,
    });

    return student;
  }
}
