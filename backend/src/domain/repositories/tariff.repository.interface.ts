import { TariffEntity } from '../entities/tariff.entity';

export abstract class ITariffRepository {
  abstract create(tariff: Partial<TariffEntity>): Promise<TariffEntity>;
  abstract findById(id: string): Promise<TariffEntity | null>;
  abstract update(id: string, tariff: Partial<TariffEntity>): Promise<TariffEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<TariffEntity[]>;
}
