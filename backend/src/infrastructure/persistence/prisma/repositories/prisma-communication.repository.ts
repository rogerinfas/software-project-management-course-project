import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICommunicationRepository } from '../../../../domain/repositories/communication.repository.interface';
import { CommunicationEntity } from '../../../../domain/entities/communication.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

@Injectable()
export class PrismaCommunicationRepository implements ICommunicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): CommunicationEntity | null {
    if (!dbRecord) return null;
    return new CommunicationEntity(dbRecord);
  }

  async create(communication: Partial<CommunicationEntity>): Promise<CommunicationEntity> {
    const record = await this.prisma.communication.create({
      data: {
        title: communication.title!,
        content: communication.content!,
        category: communication.category!,
        isVisible: communication.isVisible ?? true,
        expiresAt: communication.expiresAt,
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<CommunicationEntity | null> {
    const record = await this.prisma.communication.findUnique({
      where: { id },
    });
    return this.mapToEntity(record);
  }

  async update(
    id: string,
    communication: Partial<CommunicationEntity>,
  ): Promise<CommunicationEntity> {
    const record = await this.prisma.communication.update({
      where: { id },
      data: {
        title: communication.title,
        content: communication.content,
        category: communication.category,
        isVisible: communication.isVisible,
        expiresAt: communication.expiresAt,
      },
    });
    return this.mapToEntity(record)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.communication.delete({
      where: { id },
    });
  }

  async findManyPaginated(
    page: number,
    size: number,
    category?: string,
    search?: string,
  ): Promise<PaginatedResult<CommunicationEntity>> {
    const skip = (page - 1) * size;
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const [records, total] = await Promise.all([
      this.prisma.communication.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.communication.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);
    return {
      data: records.map((r) => this.mapToEntity(r)!),
      meta: {
        total,
        page,
        size,
        totalPages,
        hasNext: page < totalPages,
      },
    };
  }

  async findAllActive(): Promise<CommunicationEntity[]> {
    const now = new Date();
    const records = await this.prisma.communication.findMany({
      where: {
        isVisible: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
