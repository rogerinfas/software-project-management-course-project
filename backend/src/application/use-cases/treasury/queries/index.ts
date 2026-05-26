import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';

// --- Get Tariffs Query ---
export class GetTariffsQuery implements IQuery {}

@QueryHandler(GetTariffsQuery)
export class GetTariffsQueryHandler implements IQueryHandler<GetTariffsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.tariff.findMany({
      orderBy: { concept: 'asc' },
    });
  }
}

// --- Get Charges Query ---
export class GetChargesQuery implements IQuery {
  constructor(
    public readonly studentId?: string,
    public readonly status?: string,
  ) {}
}

@QueryHandler(GetChargesQuery)
export class GetChargesQueryHandler implements IQueryHandler<GetChargesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetChargesQuery) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    return this.prisma.charge.findMany({
      where,
      include: {
        student: true,
        tariff: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}

// --- Get Payments Query ---
export class GetPaymentsQuery implements IQuery {
  constructor(
    public readonly studentId?: string,
    public readonly chargeId?: string,
  ) {}
}

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsQueryHandler implements IQueryHandler<GetPaymentsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPaymentsQuery) {
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.chargeId) where.chargeId = query.chargeId;

    return this.prisma.payment.findMany({
      where,
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
  }
}

export const TreasuryQueryHandlers = [
  GetTariffsQueryHandler,
  GetChargesQueryHandler,
  GetPaymentsQueryHandler,
];
