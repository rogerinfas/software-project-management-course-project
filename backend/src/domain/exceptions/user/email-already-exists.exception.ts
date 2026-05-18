import { DomainException } from '../base/domain-exception';

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`El correo electrónico ${email} ya está registrado`, 'EMAIL_ALREADY_EXISTS');
  }
}
