import { DomainException } from '../base/domain-exception';

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Usuario con ID ${id} no encontrado`, 'USER_NOT_FOUND');
  }
}
