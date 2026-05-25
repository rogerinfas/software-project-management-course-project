import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IChargeRepository } from '../../../../domain/repositories/charge.repository.interface';
import { ChargeEntity } from '../../../../domain/entities/charge.entity';

@Injectable()
export class PrismaChargeRepository implements IChargeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): ChargeEntity | null {
    if (!dbRecord) return null;
    return new ChargeEntity(dbRecord);
  }

  async create(charge: Partial<ChargeEntity>): Promise<ChargeEntity> {
    const record = await this.prisma.charge.create({
      data: {
        studentId: charge.studentId!,
        tariffId: charge.tariffId!,
        originalAmount: charge.originalAmount!,
        pendingAmount: charge.pendingAmount!,
        dueDate: charge.dueDate,
        status: charge.status || 'PENDING',
      },
      include: {
        student: true,
        tariff: true,
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<ChargeEntity | null> {
    const record = await this.prisma.charge.findUnique({
      where: { id },
      include: {
        student: true,
        tariff: true,
      },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, charge: Partial<ChargeEntity>): Promise<ChargeEntity> {
    const record = await this.prisma.charge.update({
      where: { id },
      data: {
        studentId: charge.studentId,
        tariffId: charge.tariffId,
        originalAmount: charge.originalAmount,
        pendingAmount: charge.pendingAmount,
        dueDate: charge.dueDate,
        status: charge.status,
      },
      include: {
        student: true,
        tariff: true,
      },
    });
    return this.mapToEntity(record)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.charge.delete({
      where: { id },
    });
  }

  async findByStudentId(studentId: string): Promise<ChargeEntity[]> {
    const records = await this.prisma.charge.findMany({
      where: { studentId },
      include: {
        student: true,
        tariff: true,
      },
      orderBy: { dueDate: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async findAll(): Promise<ChargeEntity[]> {
    const records = await this.prisma.charge.findMany({
      include: {
        student: true,
        tariff: true,
      },
      orderBy: { dueDate: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
