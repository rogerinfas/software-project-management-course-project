import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IPaymentRepository } from '../../../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../../../domain/entities/payment.entity';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): PaymentEntity | null {
    if (!dbRecord) return null;
    return new PaymentEntity(dbRecord);
  }

  async create(payment: Partial<PaymentEntity>): Promise<PaymentEntity> {
    const record = await this.prisma.payment.create({
      data: {
        chargeId: payment.chargeId!,
        studentId: payment.studentId!,
        totalAmount: payment.totalAmount!,
        method: payment.method!,
        timestamp: payment.timestamp || new Date(),
      },
      include: {
        charge: {
          include: {
            tariff: true,
            student: true,
          },
        },
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const record = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        charge: {
          include: {
            tariff: true,
            student: true,
          },
        },
      },
    });
    return this.mapToEntity(record);
  }

  async findByChargeId(chargeId: string): Promise<PaymentEntity[]> {
    const records = await this.prisma.payment.findMany({
      where: { chargeId },
      include: {
        charge: {
          include: {
            tariff: true,
            student: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async findByStudentId(studentId: string): Promise<PaymentEntity[]> {
    const records = await this.prisma.payment.findMany({
      where: { studentId },
      include: {
        charge: {
          include: {
            tariff: true,
            student: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async findAll(): Promise<PaymentEntity[]> {
    const records = await this.prisma.payment.findMany({
      include: {
        charge: {
          include: {
            tariff: true,
            student: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
