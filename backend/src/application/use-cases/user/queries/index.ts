import { GetUsersQueryHandler } from './get-users.query';
import { GetUserByIdQueryHandler } from './get-user-by-id.query';
import { GetUserByEmailQueryHandler } from './get-user-by-email.query';

export const QueryHandlers = [
  GetUsersQueryHandler,
  GetUserByIdQueryHandler,
  GetUserByEmailQueryHandler,
];
