import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { EducationalLevel } from '@prisma/client';

// --- Get Courses Query ---
export class GetCoursesQuery implements IQuery {
  constructor(public readonly search?: string) {}
}

@QueryHandler(GetCoursesQuery)
export class GetCoursesQueryHandler implements IQueryHandler<GetCoursesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCoursesQuery) {
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { description: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.course.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }
}

// --- Get Schedules Query ---
export class GetSchedulesQuery implements IQuery {
  constructor(
    public readonly sectionId?: string,
    public readonly staffId?: string,
    public readonly day?: number,
  ) {}
}

@QueryHandler(GetSchedulesQuery)
export class GetSchedulesQueryHandler implements IQueryHandler<GetSchedulesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetSchedulesQuery) {
    const where: any = {};
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.staffId) where.staffId = query.staffId;
    if (query.day) where.day = query.day;

    return this.prisma.schedule.findMany({
      where,
      include: {
        section: true,
        course: true,
        staff: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }
}

// --- Get Communications Query ---
export class GetCommunicationsQuery implements IQuery {
  constructor(
    public readonly category?: string,
    public readonly search?: string,
  ) {}
}

@QueryHandler(GetCommunicationsQuery)
export class GetCommunicationsQueryHandler implements IQueryHandler<GetCommunicationsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCommunicationsQuery) {
    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' as const } },
        { content: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }

    return this.prisma.communication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}

// --- Get Teachers Query ---
export class GetTeachersQuery implements IQuery {}

@QueryHandler(GetTeachersQuery)
export class GetTeachersQueryHandler implements IQueryHandler<GetTeachersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    // Buscar todos los perfiles de docentes
    return this.prisma.staffProfile.findMany({
      where: {
        user: {
          role: 'TEACHER',
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });
  }
}

// --- Get Sections Query ---
export class GetSectionsQuery implements IQuery {
  constructor(public readonly level?: EducationalLevel) {}
}

@QueryHandler(GetSectionsQuery)
export class GetSectionsQueryHandler implements IQueryHandler<GetSectionsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetSectionsQuery) {
    const where = query.level ? { level: query.level } : {};
    return this.prisma.section.findMany({
      where,
      include: {
        students: true,
      },
      orderBy: [
        { level: 'asc' },
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });
  }
}

export const AcademicQueryHandlers = [
  GetCoursesQueryHandler,
  GetSchedulesQueryHandler,
  GetCommunicationsQueryHandler,
  GetTeachersQueryHandler,
  GetSectionsQueryHandler,
];
