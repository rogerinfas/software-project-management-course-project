import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStaffProfileDto, UpdateStaffProfileDto, RegisterAttendanceDto, UpdateAttendanceRulesDto } from './dto';
import {
  CreateStaffProfileCommand,
  UpdateStaffProfileCommand,
  DeleteStaffProfileCommand,
  RegisterAttendanceCommand,
  UpdateAttendanceRulesCommand,
} from '../../../application/use-cases/staff/commands';
import {
  GetStaffProfilesQuery,
  GetStaffProfileByIdQuery,
  GetAttendanceRecordsQuery,
  GetAttendanceRuleQuery,
} from '../../../application/use-cases/staff/queries';
import { StaffProfileEntity } from '../../../domain/entities/staff-profile.entity';
import { AttendanceRecordEntity } from '../../../domain/entities/attendance-record.entity';
import { AttendanceRuleEntity } from '../../../domain/entities/attendance-rule.entity';
import { DomainException } from '../../../domain/exceptions/domain-exception';

@ApiTags('Staff & Attendance')
@Controller('staff')
export class StaffController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ── STAFF PROFILE ENDPOINTS ────────────────────────────────────────────────

  @Post('profiles')
  @ApiOperation({ summary: 'Registrar un nuevo perfil de personal' })
  @ApiResponse({ status: HttpStatus.CREATED, type: StaffProfileEntity })
  async createProfile(@Body() dto: CreateStaffProfileDto) {
    try {
      const result = await this.commandBus.execute(
        new CreateStaffProfileCommand(
          dto.userId,
          dto.specialty,
          dto.cvUrl,
          dto.entryTime,
          dto.exitTime,
          dto.gracePeriod,
        ),
      );
      return new StaffProfileEntity(result);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get('profiles')
  @ApiOperation({ summary: 'Obtener todos los perfiles de personal' })
  @ApiResponse({ status: HttpStatus.OK, type: [StaffProfileEntity] })
  async getProfiles() {
    const results = await this.queryBus.execute(new GetStaffProfilesQuery());
    return results.map((r: any) => new StaffProfileEntity(r));
  }

  @Get('profiles/:id')
  @ApiOperation({ summary: 'Obtener perfil de personal por ID' })
  @ApiResponse({ status: HttpStatus.OK, type: StaffProfileEntity })
  async getProfileById(@Param('id') id: string) {
    const result = await this.queryBus.execute(new GetStaffProfileByIdQuery(id));
    if (!result) {
      throw new NotFoundException(`Perfil de personal con ID ${id} no encontrado`);
    }
    return new StaffProfileEntity(result);
  }

  @Put('profiles/:id')
  @ApiOperation({ summary: 'Actualizar perfil de personal' })
  @ApiResponse({ status: HttpStatus.OK, type: StaffProfileEntity })
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateStaffProfileDto) {
    try {
      const result = await this.commandBus.execute(
        new UpdateStaffProfileCommand(
          id,
          dto.specialty,
          dto.cvUrl,
          dto.entryTime,
          dto.exitTime,
          dto.gracePeriod,
        ),
      );
      return new StaffProfileEntity(result);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete('profiles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un perfil de personal' })
  async deleteProfile(@Param('id') id: string) {
    try {
      await this.commandBus.execute(new DeleteStaffProfileCommand(id));
    } catch (error) {
      if (error instanceof DomainException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // ── ATTENDANCE RECORD ENDPOINTS ─────────────────────────────────────────────

  @Post('attendance')
  @ApiOperation({ summary: 'Registrar marcación de asistencia (biometría)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AttendanceRecordEntity })
  async registerAttendance(@Body() dto: RegisterAttendanceDto) {
    try {
      const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
      const result = await this.commandBus.execute(
        new RegisterAttendanceCommand(
          dto.staffId,
          dto.type,
          timestamp,
          dto.method,
        ),
      );
      return new AttendanceRecordEntity(result);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('attendance')
  @ApiOperation({ summary: 'Obtener historial de asistencia completo o filtrado' })
  @ApiResponse({ status: HttpStatus.OK, type: [AttendanceRecordEntity] })
  async getAttendance(@Query('staffId') staffId?: string) {
    const results = await this.queryBus.execute(new GetAttendanceRecordsQuery(staffId));
    return results.map((r: any) => new AttendanceRecordEntity(r));
  }

  // ── ATTENDANCE RULES ENDPOINTS ──────────────────────────────────────────────

  @Get('rules')
  @ApiOperation({ summary: 'Obtener reglas globales de asistencia' })
  @ApiResponse({ status: HttpStatus.OK, type: AttendanceRuleEntity })
  async getRules() {
    const result = await this.queryBus.execute(new GetAttendanceRuleQuery());
    return result ? new AttendanceRuleEntity(result) : null;
  }

  @Put('rules')
  @ApiOperation({ summary: 'Actualizar reglas globales de asistencia' })
  @ApiResponse({ status: HttpStatus.OK, type: AttendanceRuleEntity })
  async updateRules(@Body() dto: UpdateAttendanceRulesDto) {
    const result = await this.commandBus.execute(
      new UpdateAttendanceRulesCommand(dto.gracePeriodMinutes, dto.finePerMinute),
    );
    return new AttendanceRuleEntity(result);
  }
}
