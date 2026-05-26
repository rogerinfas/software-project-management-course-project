import { DomainException } from './domain-exception';

export class TariffNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Tarifa con ID ${id} no encontrada`, 'TARIFF_NOT_FOUND');
  }
}

export class ChargeNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Cargo con ID ${id} no encontrado`, 'CHARGE_NOT_FOUND');
  }
}

export class InvalidPaymentAmountException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_PAYMENT_AMOUNT');
  }
}

export class PaymentNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Pago con ID ${id} no encontrado`, 'PAYMENT_NOT_FOUND');
  }
}
