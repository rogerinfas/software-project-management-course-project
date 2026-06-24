import {
  GetCoursesQuery,
  GetCoursesQueryHandler,
  GetSchedulesQuery,
  GetSchedulesQueryHandler,
  GetCommunicationsQuery,
  GetCommunicationsQueryHandler,
  GetTeachersQuery,
  GetTeachersQueryHandler,
  GetSectionsQuery,
  GetSectionsQueryHandler,
} from './index';
import { EducationalLevel } from '@prisma/client';

describe('Academic Queries', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = {
      course: { findMany: jest.fn() },
      schedule: { findMany: jest.fn() },
      communication: { findMany: jest.fn() },
      user: { findMany: jest.fn() },
      section: { findMany: jest.fn() },
    };
  });

  describe('GetCoursesQueryHandler', () => {
    it('should find all courses with search term', async () => {
      const handler = new GetCoursesQueryHandler(prisma);
      prisma.course.findMany.mockResolvedValue([{ id: 'c-1', name: 'Math' }]);

      const query = new GetCoursesQuery('Math');
      const result = await handler.execute(query);

      expect(result).toEqual([{ id: 'c-1', name: 'Math' }]);
      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'Math', mode: 'insensitive' } },
            { description: { contains: 'Math', mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('GetSchedulesQueryHandler', () => {
    it('should return schedules matching sectionId', async () => {
      const handler = new GetSchedulesQueryHandler(prisma);
      prisma.schedule.findMany.mockResolvedValue([]);

      const query = new GetSchedulesQuery('sec-1');
      await handler.execute(query);

      expect(prisma.schedule.findMany).toHaveBeenCalledWith({
        where: { sectionId: 'sec-1' },
        include: {
          section: true,
          course: true,
          staff: true,
        },
        orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
      });
    });
  });

  describe('GetCommunicationsQueryHandler', () => {
    it('should return communications matching category', async () => {
      const handler = new GetCommunicationsQueryHandler(prisma);
      prisma.communication.findMany.mockResolvedValue([]);

      const query = new GetCommunicationsQuery('General', 'search');
      await handler.execute(query);

      expect(prisma.communication.findMany).toHaveBeenCalledWith({
        where: {
          category: 'General',
          OR: [
            { title: { contains: 'search', mode: 'insensitive' } },
            { content: { contains: 'search', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('GetTeachersQueryHandler', () => {
    it('should return teacher user profiles', async () => {
      const handler = new GetTeachersQueryHandler(prisma);
      prisma.user.findMany.mockResolvedValue([]);

      await handler.execute();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'TEACHER' },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('GetSectionsQueryHandler', () => {
    it('should return sections matching level', async () => {
      const handler = new GetSectionsQueryHandler(prisma);
      prisma.section.findMany.mockResolvedValue([]);

      const query = new GetSectionsQuery(EducationalLevel.PRIMARY);
      await handler.execute(query);

      expect(prisma.section.findMany).toHaveBeenCalledWith({
        where: { level: EducationalLevel.PRIMARY },
        include: { students: true },
        orderBy: [{ level: 'asc' }, { grade: 'asc' }, { name: 'asc' }],
      });
    });
  });
});
