import { DomainException } from './domain-exception';

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Usuario con ID ${id} no encontrado`, 'USER_NOT_FOUND');
  }
}

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(
      `El correo electrónico ${email} ya está registrado`,
      'EMAIL_ALREADY_EXISTS',
    );
  }
}
