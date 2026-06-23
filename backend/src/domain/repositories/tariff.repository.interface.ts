import { TariffEntity } from '../entities/tariff.entity';

export interface ITariffRepository {
  create(tariff: Partial<TariffEntity>): Promise<TariffEntity>;
  findById(id: string): Promise<TariffEntity | null>;
  update(
    id: string,
    tariff: Partial<TariffEntity>,
  ): Promise<TariffEntity>;
  delete(id: string): Promise<void>;
  findAll(): Promise<TariffEntity[]>;
}
