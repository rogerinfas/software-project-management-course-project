import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { EducationalLevel } from '@prisma/client';
import { SectionNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

// --- Create Section ---
export class CreateSectionCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly grade: string,
    public readonly level: EducationalLevel,
    public readonly capacity: number,
    public readonly status?: string,
  ) {}
}

@CommandHandler(CreateSectionCommand)
export class CreateSectionCommandHandler implements ICommandHandler<CreateSectionCommand> {
  constructor(
    @Inject('ISectionRepository')
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(command: CreateSectionCommand): Promise<SectionEntity> {
    return this.sectionRepository.create({
      name: command.name,
      grade: command.grade,
      level: command.level,
      capacity: command.capacity,
      status: command.status ?? 'OPEN',
    });
  }
}

// --- Update Section ---
export class UpdateSectionCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly grade?: string,
    public readonly level?: EducationalLevel,
    public readonly capacity?: number,
    public readonly status?: string,
  ) {}
}

@CommandHandler(UpdateSectionCommand)
export class UpdateSectionCommandHandler implements ICommandHandler<UpdateSectionCommand> {
  constructor(
    @Inject('ISectionRepository')
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(command: UpdateSectionCommand): Promise<SectionEntity> {
    const section = await this.sectionRepository.findById(command.id);
    if (!section) {
      throw new SectionNotFoundException(command.id);
    }

    return this.sectionRepository.update(command.id, {
      name: command.name,
      grade: command.grade,
      level: command.level,
      capacity: command.capacity,
      status: command.status,
    });
  }
}

// --- Delete Section ---
export class DeleteSectionCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteSectionCommand)
export class DeleteSectionCommandHandler implements ICommandHandler<DeleteSectionCommand> {
  constructor(
    @Inject('ISectionRepository')
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(command: DeleteSectionCommand): Promise<void> {
    const section = await this.sectionRepository.findById(command.id);
    if (!section) {
      throw new SectionNotFoundException(command.id);
    }
    await this.sectionRepository.delete(command.id);
  }
}
