import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IStaffProfileRepository } from '../../../../domain/repositories/staff-profile.repository.interface';
import { IAttendanceRecordRepository } from '../../../../domain/repositories/attendance-record.repository.interface';
import { IAttendanceRuleRepository } from '../../../../domain/repositories/attendance-rule.repository.interface';
import { StaffProfileEntity } from '../../../../domain/entities/staff-profile.entity';
import { AttendanceRecordEntity } from '../../../../domain/entities/attendance-record.entity';
import { AttendanceRuleEntity } from '../../../../domain/entities/attendance-rule.entity';

// ── GET STAFF PROFILES QUERY ─────────────────────────────────────────────────

export class GetStaffProfilesQuery implements IQuery {}

@QueryHandler(GetStaffProfilesQuery)
export class GetStaffProfilesQueryHandler implements IQueryHandler<GetStaffProfilesQuery> {
  constructor(
    @Inject('IStaffProfileRepository')
    private readonly staffRepository: IStaffProfileRepository,
  ) {}

  async execute(query: GetStaffProfilesQuery): Promise<StaffProfileEntity[]> {
    return this.staffRepository.findAll();
  }
}

// ── GET STAFF PROFILE BY ID QUERY ────────────────────────────────────────────

export class GetStaffProfileByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetStaffProfileByIdQuery)
export class GetStaffProfileByIdQueryHandler implements IQueryHandler<GetStaffProfileByIdQuery> {
  constructor(
    @Inject('IStaffProfileRepository')
    private readonly staffRepository: IStaffProfileRepository,
  ) {}

  async execute(query: GetStaffProfileByIdQuery): Promise<StaffProfileEntity | null> {
    return this.staffRepository.findById(query.id);
  }
}

// ── GET ATTENDANCE RECORDS QUERY ─────────────────────────────────────────────

export class GetAttendanceRecordsQuery implements IQuery {
  constructor(public readonly staffId?: string) {}
}

@QueryHandler(GetAttendanceRecordsQuery)
export class GetAttendanceRecordsQueryHandler implements IQueryHandler<GetAttendanceRecordsQuery> {
  constructor(
    @Inject('IAttendanceRecordRepository')
    private readonly recordRepository: IAttendanceRecordRepository,
  ) {}

  async execute(query: GetAttendanceRecordsQuery): Promise<AttendanceRecordEntity[]> {
    if (query.staffId) {
      return this.recordRepository.findByStaffId(query.staffId);
    }
    return this.recordRepository.findAll();
  }
}

// ── GET ATTENDANCE RULE QUERY ────────────────────────────────────────────────

export class GetAttendanceRuleQuery implements IQuery {}

@QueryHandler(GetAttendanceRuleQuery)
export class GetAttendanceRuleQueryHandler implements IQueryHandler<GetAttendanceRuleQuery> {
  constructor(
    @Inject('IAttendanceRuleRepository')
    private readonly ruleRepository: IAttendanceRuleRepository,
  ) {}

  async execute(query: GetAttendanceRuleQuery): Promise<AttendanceRuleEntity | null> {
    return this.ruleRepository.getRule();
  }
}
