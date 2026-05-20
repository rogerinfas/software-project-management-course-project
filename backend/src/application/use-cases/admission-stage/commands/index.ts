import { CreateStageCommandHandler } from './create-stage.command';
import { UpdateStageCommandHandler } from './update-stage.command';
import { DeleteStageCommandHandler } from './delete-stage.command';

export const StageCommandHandlers = [
  CreateStageCommandHandler,
  UpdateStageCommandHandler,
  DeleteStageCommandHandler,
];
