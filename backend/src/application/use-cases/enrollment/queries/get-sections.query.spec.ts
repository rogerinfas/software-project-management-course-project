import { GetSectionsQuery, GetSectionsQueryHandler } from './get-sections.query';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { EducationalLevel } from '@prisma/client';

describe('GetSectionsQueryHandler', () => {
  let handler: GetSectionsQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    };
    handler = new GetSectionsQueryHandler(repository);
  });

  it('should return all sections', async () => {
    const list = [new SectionEntity({ id: 's-1', name: 'A', grade: '1', level: EducationalLevel.PRIMARY, capacity: 20 })];
    repository.findAll.mockResolvedValue(list);

    const query = new GetSectionsQuery();
    const result = await handler.execute();

    expect(result).toBe(list);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
