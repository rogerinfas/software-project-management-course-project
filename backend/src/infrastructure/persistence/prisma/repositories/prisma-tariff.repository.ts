import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ITariffRepository } from '../../../../domain/repositories/tariff.repository.interface';
import { TariffEntity } from '../../../../domain/entities/tariff.entity';

@Injectable()
export class PrismaTariffRepository implements ITariffRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): TariffEntity | null {
    if (!dbRecord) return null;
    return new TariffEntity(dbRecord);
  }

  async create(tariff: Partial<TariffEntity>): Promise<TariffEntity> {
    const record = await this.prisma.tariff.create({
      data: {
        concept: tariff.concept!,
        amount: tariff.amount!,
        type: tariff.type!,
        level: tariff.level!,
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<TariffEntity | null> {
    const record = await this.prisma.tariff.findUnique({
      where: { id },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, tariff: Partial<TariffEntity>): Promise<TariffEntity> {
    const record = await this.prisma.tariff.update({
      where: { id },
      data: {
        concept: tariff.concept,
        amount: tariff.amount,
        type: tariff.type,
        level: tariff.level,
      },
    });
    return this.mapToEntity(record)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tariff.delete({
      where: { id },
    });
  }

  async findAll(): Promise<TariffEntity[]> {
    const records = await this.prisma.tariff.findMany({
      orderBy: { concept: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
