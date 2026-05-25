import { CreateTariffCommandHandler, UpdateTariffCommandHandler, DeleteTariffCommandHandler } from './tariff.commands';
import { CreateChargeCommandHandler, GenerateBulkChargesCommandHandler, DeleteChargeCommandHandler } from './charge.commands';
import { RegisterPaymentCommandHandler } from './payment.commands';

export * from './tariff.commands';
export * from './charge.commands';
export * from './payment.commands';

export const TreasuryCommandHandlers = [
  CreateTariffCommandHandler,
  UpdateTariffCommandHandler,
  DeleteTariffCommandHandler,
  CreateChargeCommandHandler,
  GenerateBulkChargesCommandHandler,
  DeleteChargeCommandHandler,
  RegisterPaymentCommandHandler,
];
