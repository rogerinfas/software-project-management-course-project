import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IProspectInteractionRepository } from '../../../../domain/repositories/interaction.repository.interface';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';

@Injectable()
export class PrismaProspectInteractionRepository implements IProspectInteractionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    interaction: Partial<ProspectInteractionEntity>,
  ): Promise<ProspectInteractionEntity> {
    const created = await this.prisma.prospectInteraction.create({
      data: {
        prospectId: interaction.prospectId!,
        type: interaction.type!,
        summary: interaction.summary!,
        author: interaction.author!,
        date: interaction.date || new Date(),
      },
    });

    return new ProspectInteractionEntity(created);
  }

  async findById(id: string): Promise<ProspectInteractionEntity | null> {
    const record = await this.prisma.prospectInteraction.findUnique({
      where: { id },
    });
    if (!record) return null;
    return new ProspectInteractionEntity(record);
  }

  async update(
    id: string,
    interaction: Partial<ProspectInteractionEntity>,
  ): Promise<ProspectInteractionEntity> {
    const updated = await this.prisma.prospectInteraction.update({
      where: { id },
      data: {
        type: interaction.type,
        summary: interaction.summary,
        author: interaction.author,
        date: interaction.date,
      },
    });

    return new ProspectInteractionEntity(updated);
  }

  async findByProspectId(
    prospectId: string,
  ): Promise<ProspectInteractionEntity[]> {
    const records = await this.prisma.prospectInteraction.findMany({
      where: { prospectId },
      orderBy: { date: 'desc' },
    });

    return records.map((record) => new ProspectInteractionEntity(record));
  }
}
