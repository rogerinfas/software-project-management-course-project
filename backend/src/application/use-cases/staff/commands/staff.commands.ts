import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IStaffProfileRepository } from '../../../../domain/repositories/staff-profile.repository.interface';
import { IAttendanceRecordRepository } from '../../../../domain/repositories/attendance-record.repository.interface';
import { IAttendanceRuleRepository } from '../../../../domain/repositories/attendance-rule.repository.interface';
import { StaffProfileEntity } from '../../../../domain/entities/staff-profile.entity';
import { AttendanceRecordEntity } from '../../../../domain/entities/attendance-record.entity';
import { AttendanceRuleEntity } from '../../../../domain/entities/attendance-rule.entity';
import {
  StaffProfileNotFoundException,
  DuplicateStaffProfileException,
  AttendanceRecordNotFoundException,
} from '../../../../domain/exceptions/staff-domain.exceptions';

// ── STAFF PROFILE COMMANDS ───────────────────────────────────────────────────

export class CreateStaffProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly specialty: string,
    public readonly cvUrl?: string,
    public readonly entryTime?: string,
    public readonly exitTime?: string,
    public readonly gracePeriod?: number,
  ) {}
}

@CommandHandler(CreateStaffProfileCommand)
export class CreateStaffProfileCommandHandler implements ICommandHandler<CreateStaffProfileCommand> {
  constructor(
    @Inject('IStaffProfileRepository')
    private readonly staffRepository: IStaffProfileRepository,
  ) {}

  async execute(command: CreateStaffProfileCommand): Promise<StaffProfileEntity> {
    const existing = await this.staffRepository.findByUserId(command.userId);
    if (existing) {
      throw new DuplicateStaffProfileException(command.userId);
    }
    return this.staffRepository.create({
      userId: command.userId,
      specialty: command.specialty,
      cvUrl: command.cvUrl,
      entryTime: command.entryTime || '08:00',
      exitTime: command.exitTime || '16:00',
      gracePeriod: command.gracePeriod !== undefined ? command.gracePeriod : 5,
    });
  }
}

export class UpdateStaffProfileCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly specialty?: string,
    public readonly cvUrl?: string,
    public readonly entryTime?: string,
    public readonly exitTime?: string,
    public readonly gracePeriod?: number,
  ) {}
}

@CommandHandler(UpdateStaffProfileCommand)
export class UpdateStaffProfileCommandHandler implements ICommandHandler<UpdateStaffProfileCommand> {
  constructor(
    @Inject('IStaffProfileRepository')
    private readonly staffRepository: IStaffProfileRepository,
  ) {}

  async execute(command: UpdateStaffProfileCommand): Promise<StaffProfileEntity> {
    const staff = await this.staffRepository.findById(command.id);
    if (!staff) {
      throw new StaffProfileNotFoundException(command.id);
    }
    return this.staffRepository.update(command.id, {
      specialty: command.specialty,
      cvUrl: command.cvUrl,
      entryTime: command.entryTime,
      exitTime: command.exitTime,
      gracePeriod: command.gracePeriod,
    });
  }
}

export class DeleteStaffProfileCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteStaffProfileCommand)
export class DeleteStaffProfileCommandHandler implements ICommandHandler<DeleteStaffProfileCommand> {
  constructor(
    @Inject('IStaffProfileRepository')
    private readonly staffRepository: IStaffProfileRepository,
  ) {}

  async execute(command: DeleteStaffProfileCommand): Promise<void> {
    const staff = await this.staffRepository.findById(command.id);
    if (!staff) {
      throw new StaffProfileNotFoundException(command.id);
    }
    await this.staffRepository.delete(command.id);
  }
}

// ── ATTENDANCE RECORD COMMANDS ───────────────────────────────────────────────

export class RegisterAttendanceCommand implements ICommand {
  constructor(
    public readonly staffId: string,
    public readonly type: string, // entry, exit
    public readonly timestamp?: Date,
    public readonly method?: string,
  ) {}
}

@CommandHandler(RegisterAttendanceCommand)
export class RegisterAttendanceCommandHandler implements ICommandHandler<RegisterAttendanceCommand> {
  constructor(
    @Inject('IStaffProfileRepository')
    private readonly staffRepository: IStaffProfileRepository,
    @Inject('IAttendanceRecordRepository')
    private readonly recordRepository: IAttendanceRecordRepository,
    @Inject('IAttendanceRuleRepository')
    private readonly ruleRepository: IAttendanceRuleRepository,
  ) {}

  async execute(command: RegisterAttendanceCommand): Promise<AttendanceRecordEntity> {
    const staff = await this.staffRepository.findById(command.staffId);
    if (!staff) {
      throw new StaffProfileNotFoundException(command.staffId);
    }

    const timestamp = command.timestamp || new Date();
    let delayMinutes = 0;
    let fineAmount = 0.0;

    // Only calculate delay and fine for entry type
    if (command.type === 'entry') {
      const globalRule = await this.ruleRepository.getRule();
      const fineRate = globalRule?.finePerMinute || 0.5;

      const [targetHour, targetMin] = staff.entryTime.split(':').map(Number);
      const actualHour = timestamp.getHours();
      const actualMin = timestamp.getMinutes();

      const targetTotal = targetHour * 60 + targetMin;
      const actualTotal = actualHour * 60 + actualMin;

      // If they arrived after entryTime + gracePeriod
      if (actualTotal > targetTotal + staff.gracePeriod) {
        delayMinutes = actualTotal - targetTotal;
        fineAmount = delayMinutes * fineRate;
      }
    }

    return this.recordRepository.create({
      staffId: command.staffId,
      type: command.type,
      timestamp,
      method: command.method || 'FACIAL',
      delayMinutes,
      fineAmount,
    });
  }
}

// ── ATTENDANCE RULES COMMAND ─────────────────────────────────────────────────

export class UpdateAttendanceRulesCommand implements ICommand {
  constructor(
    public readonly gracePeriodMinutes: number,
    public readonly finePerMinute: number,
  ) {}
}

@CommandHandler(UpdateAttendanceRulesCommand)
export class UpdateAttendanceRulesCommandHandler implements ICommandHandler<UpdateAttendanceRulesCommand> {
  constructor(
    @Inject('IAttendanceRuleRepository')
    private readonly ruleRepository: IAttendanceRuleRepository,
  ) {}

  async execute(command: UpdateAttendanceRulesCommand): Promise<AttendanceRuleEntity> {
    return this.ruleRepository.updateRule({
      gracePeriodMinutes: command.gracePeriodMinutes,
      finePerMinute: command.finePerMinute,
    });
  }
}
