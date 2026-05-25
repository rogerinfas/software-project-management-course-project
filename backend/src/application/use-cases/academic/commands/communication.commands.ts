import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ICommunicationRepository } from '../../../../domain/repositories/communication.repository.interface';
import { CommunicationEntity } from '../../../../domain/entities/communication.entity';
import { CommunicationNotFoundException } from '../../../../domain/exceptions/academic-domain.exceptions';

// --- Create Communication ---
export class CreateCommunicationCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly category: string,
    public readonly isVisible?: boolean,
    public readonly expiresAt?: Date | null,
  ) {}
}

@CommandHandler(CreateCommunicationCommand)
export class CreateCommunicationCommandHandler implements ICommandHandler<CreateCommunicationCommand> {
  constructor(
    @Inject('ICommunicationRepository')
    private readonly communicationRepository: ICommunicationRepository,
  ) {}

  async execute(command: CreateCommunicationCommand): Promise<CommunicationEntity> {
    return this.communicationRepository.create({
      title: command.title,
      content: command.content,
      category: command.category,
      isVisible: command.isVisible ?? true,
      expiresAt: command.expiresAt,
    });
  }
}

// --- Update Communication ---
export class UpdateCommunicationCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly category?: string,
    public readonly isVisible?: boolean,
    public readonly expiresAt?: Date | null,
  ) {}
}

@CommandHandler(UpdateCommunicationCommand)
export class UpdateCommunicationCommandHandler implements ICommandHandler<UpdateCommunicationCommand> {
  constructor(
    @Inject('ICommunicationRepository')
    private readonly communicationRepository: ICommunicationRepository,
  ) {}

  async execute(command: UpdateCommunicationCommand): Promise<CommunicationEntity> {
    const communication = await this.communicationRepository.findById(command.id);
    if (!communication) {
      throw new CommunicationNotFoundException(command.id);
    }

    return this.communicationRepository.update(command.id, {
      title: command.title,
      content: command.content,
      category: command.category,
      isVisible: command.isVisible,
      expiresAt: command.expiresAt,
    });
  }
}

// --- Delete Communication ---
export class DeleteCommunicationCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteCommunicationCommand)
export class DeleteCommunicationCommandHandler implements ICommandHandler<DeleteCommunicationCommand> {
  constructor(
    @Inject('ICommunicationRepository')
    private readonly communicationRepository: ICommunicationRepository,
  ) {}

  async execute(command: DeleteCommunicationCommand): Promise<void> {
    const communication = await this.communicationRepository.findById(command.id);
    if (!communication) {
      throw new CommunicationNotFoundException(command.id);
    }
    await this.communicationRepository.delete(command.id);
  }
}
