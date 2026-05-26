import { CreateInteractionCommandHandler } from './create-interaction.command';
import { UpdateInteractionCommandHandler } from './update-interaction.command';

export * from './create-interaction.command';
export * from './update-interaction.command';

export const InteractionCommandHandlers = [
  CreateInteractionCommandHandler,
  UpdateInteractionCommandHandler,
];
