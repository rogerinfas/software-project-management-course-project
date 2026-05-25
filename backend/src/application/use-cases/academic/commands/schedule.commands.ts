import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IScheduleRepository } from '../../../../domain/repositories/schedule.repository.interface';
import { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import { ICourseRepository } from '../../../../domain/repositories/course.repository.interface';
import { ScheduleEntity } from '../../../../domain/entities/schedule.entity';
import {
  ScheduleNotFoundException,
  ScheduleConflictException,
  CourseNotFoundException,
} from '../../../../domain/exceptions/academic-domain.exceptions';
import { SectionNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

// --- Create Schedule ---
export class CreateScheduleCommand implements ICommand {
  constructor(
    public readonly sectionId: string,
    public readonly courseId: string,
    public readonly staffId: string,
    public readonly day: number,
    public readonly startTime: string,
    public readonly endTime: string,
  ) {}
}

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleCommandHandler implements ICommandHandler<CreateScheduleCommand> {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('ISectionRepository')
    private readonly sectionRepository: ISectionRepository,
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: CreateScheduleCommand): Promise<ScheduleEntity> {
    // 1. Validar sección
    const section = await this.sectionRepository.findById(command.sectionId);
    if (!section) {
      throw new SectionNotFoundException(command.sectionId);
    }

    // 2. Validar curso
    const course = await this.courseRepository.findById(command.courseId);
    if (!course) {
      throw new CourseNotFoundException(command.courseId);
    }

    // 3. Validar conflictos de horario (docente o sección ocupada en el mismo rango de hora y día)
    const conflicts = await this.scheduleRepository.checkConflicts(
      command.day,
      command.startTime,
      command.endTime,
      command.sectionId,
      command.staffId,
    );

    if (conflicts.length > 0) {
      const sectionConflict = conflicts.find((c) => c.sectionId === command.sectionId);
      if (sectionConflict) {
        throw new ScheduleConflictException(
          `Conflicto: La sección ya tiene asignada una clase en este día (${command.day}) de ${command.startTime} a ${command.endTime}`,
        );
      }
      const teacherConflict = conflicts.find((c) => c.staffId === command.staffId);
      if (teacherConflict) {
        throw new ScheduleConflictException(
          `Conflicto: El docente ya está programado en otra sección para este día (${command.day}) de ${command.startTime} a ${command.endTime}`,
        );
      }
    }

    return this.scheduleRepository.create({
      sectionId: command.sectionId,
      courseId: command.courseId,
      staffId: command.staffId,
      day: command.day,
      startTime: command.startTime,
      endTime: command.endTime,
    });
  }
}

// --- Update Schedule ---
export class UpdateScheduleCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly sectionId?: string,
    public readonly courseId?: string,
    public readonly staffId?: string,
    public readonly day?: number,
    public readonly startTime?: string,
    public readonly endTime?: string,
  ) {}
}

@CommandHandler(UpdateScheduleCommand)
export class UpdateScheduleCommandHandler implements ICommandHandler<UpdateScheduleCommand> {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('ISectionRepository')
    private readonly sectionRepository: ISectionRepository,
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: UpdateScheduleCommand): Promise<ScheduleEntity> {
    const schedule = await this.scheduleRepository.findById(command.id);
    if (!schedule) {
      throw new ScheduleNotFoundException(command.id);
    }

    const sectionId = command.sectionId ?? schedule.sectionId;
    const courseId = command.courseId ?? schedule.courseId;
    const staffId = command.staffId ?? schedule.staffId;
    const day = command.day ?? schedule.day;
    const startTime = command.startTime ?? schedule.startTime;
    const endTime = command.endTime ?? schedule.endTime;

    if (command.sectionId) {
      const section = await this.sectionRepository.findById(sectionId);
      if (!section) {
        throw new SectionNotFoundException(sectionId);
      }
    }

    if (command.courseId) {
      const course = await this.courseRepository.findById(courseId);
      if (!course) {
        throw new CourseNotFoundException(courseId);
      }
    }

    // Validar conflictos excluyendo el propio horario que se edita
    const conflicts = await this.scheduleRepository.checkConflicts(
      day,
      startTime,
      endTime,
      sectionId,
      staffId,
      command.id,
    );

    if (conflicts.length > 0) {
      const sectionConflict = conflicts.find((c) => c.sectionId === sectionId);
      if (sectionConflict) {
        throw new ScheduleConflictException(
          `Conflicto: La sección ya tiene asignada una clase en este día (${day}) de ${startTime} a ${endTime}`,
        );
      }
      const teacherConflict = conflicts.find((c) => c.staffId === staffId);
      if (teacherConflict) {
        throw new ScheduleConflictException(
          `Conflicto: El docente ya está programado en otra sección para este día (${day}) de ${startTime} a ${endTime}`,
        );
      }
    }

    return this.scheduleRepository.update(command.id, {
      sectionId,
      courseId,
      staffId,
      day,
      startTime,
      endTime,
    });
  }
}

// --- Delete Schedule ---
export class DeleteScheduleCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleCommandHandler implements ICommandHandler<DeleteScheduleCommand> {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(command: DeleteScheduleCommand): Promise<void> {
    const schedule = await this.scheduleRepository.findById(command.id);
    if (!schedule) {
      throw new ScheduleNotFoundException(command.id);
    }
    await this.scheduleRepository.delete(command.id);
  }
}
