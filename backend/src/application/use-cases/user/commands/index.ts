import { CreateUserCommandHandler } from './create-user.command';
import { UpdateUserCommandHandler } from './update-user.command';
import { DeleteUserCommandHandler } from './delete-user.command';

export const CommandHandlers = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
];
