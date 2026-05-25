import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ICourseRepository } from '../../../../domain/repositories/course.repository.interface';
import { CourseEntity } from '../../../../domain/entities/course.entity';
import {
  CourseNotFoundException,
  CourseAlreadyExistsException,
} from '../../../../domain/exceptions/academic-domain.exceptions';

// --- Create Course ---
export class CreateCourseCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description?: string | null,
  ) {}
}

@CommandHandler(CreateCourseCommand)
export class CreateCourseCommandHandler implements ICommandHandler<CreateCourseCommand> {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: CreateCourseCommand): Promise<CourseEntity> {
    const existing = await this.courseRepository.findByName(command.name);
    if (existing) {
      throw new CourseAlreadyExistsException(command.name);
    }
    return this.courseRepository.create({
      name: command.name,
      description: command.description,
    });
  }
}

// --- Update Course ---
export class UpdateCourseCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string | null,
  ) {}
}

@CommandHandler(UpdateCourseCommand)
export class UpdateCourseCommandHandler implements ICommandHandler<UpdateCourseCommand> {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: UpdateCourseCommand): Promise<CourseEntity> {
    const course = await this.courseRepository.findById(command.id);
    if (!course) {
      throw new CourseNotFoundException(command.id);
    }

    if (command.name && command.name !== course.name) {
      const existing = await this.courseRepository.findByName(command.name);
      if (existing) {
        throw new CourseAlreadyExistsException(command.name);
      }
    }

    return this.courseRepository.update(command.id, {
      name: command.name,
      description: command.description,
    });
  }
}

// --- Delete Course ---
export class DeleteCourseCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteCourseCommand)
export class DeleteCourseCommandHandler implements ICommandHandler<DeleteCourseCommand> {
  constructor(
    @Inject('ICourseRepository')
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: DeleteCourseCommand): Promise<void> {
    const course = await this.courseRepository.findById(command.id);
    if (!course) {
      throw new CourseNotFoundException(command.id);
    }
    await this.courseRepository.delete(command.id);
  }
}
