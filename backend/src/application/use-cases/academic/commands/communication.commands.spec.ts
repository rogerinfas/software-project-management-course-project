import {
  CreateCommunicationCommand,
  CreateCommunicationCommandHandler,
  UpdateCommunicationCommand,
  UpdateCommunicationCommandHandler,
  DeleteCommunicationCommand,
  DeleteCommunicationCommandHandler,
} from './communication.commands';
import { CommunicationEntity } from '../../../../domain/entities/communication.entity';
import { CommunicationNotFoundException } from '../../../../domain/exceptions/academic-domain.exceptions';

describe('Communication Commands', () => {
  let communicationRepository: any;

  beforeEach(() => {
    communicationRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateCommunicationCommandHandler', () => {
    it('should create and return a communication', async () => {
      const created = new CommunicationEntity({ id: 'comm-1', title: 'Welcome', content: 'Hello', category: 'General', isVisible: true });
      communicationRepository.create.mockResolvedValue(created);

      const handler = new CreateCommunicationCommandHandler(communicationRepository);
      const command = new CreateCommunicationCommand('Welcome', 'Hello', 'General');
      const result = await handler.execute(command);

      expect(result).toBe(created);
      expect(communicationRepository.create).toHaveBeenCalledWith({
        title: 'Welcome',
        content: 'Hello',
        category: 'General',
        isVisible: true,
        expiresAt: undefined,
      });
    });
  });

  describe('UpdateCommunicationCommandHandler', () => {
    it('should throw CommunicationNotFoundException if communication not found', async () => {
      communicationRepository.findById.mockResolvedValue(null);

      const handler = new UpdateCommunicationCommandHandler(communicationRepository);
      const command = new UpdateCommunicationCommand('non-existent-id', 'Title');

      await expect(handler.execute(command)).rejects.toThrow(CommunicationNotFoundException);
    });

    it('should update and return the updated communication', async () => {
      const communication = new CommunicationEntity({ id: 'comm-1', title: 'Welcome', content: 'Hello', category: 'General' });
      const updated = new CommunicationEntity({ id: 'comm-1', title: 'Welcome Updated', content: 'Hello World', category: 'General' });
      communicationRepository.findById.mockResolvedValue(communication);
      communicationRepository.update.mockResolvedValue(updated);

      const handler = new UpdateCommunicationCommandHandler(communicationRepository);
      const command = new UpdateCommunicationCommand('comm-1', 'Welcome Updated', 'Hello World');
      const result = await handler.execute(command);

      expect(result).toBe(updated);
      expect(communicationRepository.update).toHaveBeenCalledWith('comm-1', {
        title: 'Welcome Updated',
        content: 'Hello World',
        category: undefined,
        isVisible: undefined,
        expiresAt: undefined,
      });
    });
  });

  describe('DeleteCommunicationCommandHandler', () => {
    it('should throw CommunicationNotFoundException if not found', async () => {
      communicationRepository.findById.mockResolvedValue(null);

      const handler = new DeleteCommunicationCommandHandler(communicationRepository);
      const command = new DeleteCommunicationCommand('non-existent-id');

      await expect(handler.execute(command)).rejects.toThrow(CommunicationNotFoundException);
    });

    it('should delete if found', async () => {
      const communication = new CommunicationEntity({ id: 'comm-1', title: 'Welcome', content: 'Hello', category: 'General' });
      communicationRepository.findById.mockResolvedValue(communication);

      const handler = new DeleteCommunicationCommandHandler(communicationRepository);
      const command = new DeleteCommunicationCommand('comm-1');
      await handler.execute(command);

      expect(communicationRepository.delete).toHaveBeenCalledWith('comm-1');
    });
  });
});
