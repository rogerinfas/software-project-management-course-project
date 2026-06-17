import { TariffEntity } from './tariff.entity';
import { TariffType, EducationalLevel } from '@prisma/client';

describe('TariffEntity', () => {
  it('should create a TariffEntity instance and populate fields', () => {
    const data = {
      id: 'tariff-1',
      concept: 'Matrícula Anual',
      amount: 400.0,
      type: TariffType.EXTRA,
      level: EducationalLevel.PRIMARY,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new TariffEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.concept).toBe(data.concept);
    expect(entity.amount).toBe(data.amount);
    expect(entity.type).toBe(data.type);
    expect(entity.level).toBe(data.level);
  });
});
