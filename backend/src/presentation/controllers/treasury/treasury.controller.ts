import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// DTOs & Entities
import {
  CreateTariffDto,
  UpdateTariffDto,
  TariffResponse,
  CreateChargeDto,
  GenerateBulkChargesDto,
  ChargeResponse,
  RegisterPaymentDto,
  PaymentResponse,
} from './dto';

import { TariffEntity } from '../../../domain/entities/tariff.entity';
import { ChargeEntity } from '../../../domain/entities/charge.entity';
import { PaymentEntity } from '../../../domain/entities/payment.entity';

// CQRS Commands
import {
  CreateTariffCommand,
  UpdateTariffCommand,
  DeleteTariffCommand,
  CreateChargeCommand,
  GenerateBulkChargesCommand,
  DeleteChargeCommand,
  RegisterPaymentCommand,
} from '../../../application/use-cases/treasury/commands';

// CQRS Queries
import {
  GetTariffsQuery,
  GetChargesQuery,
  GetPaymentsQuery,
} from '../../../application/use-cases/treasury/queries';

@ApiTags('treasury')
@Controller('treasury')
export class TreasuryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ─── TARIFFS ───────────────────────────────────────────────────────────────

  @Get('tariffs')
  @ApiOperation({ summary: 'List all active school tariffs' })
  @ApiResponse({ status: 200, type: [TariffResponse] })
  async getTariffs(): Promise<TariffResponse[]> {
    const results = await this.queryBus.execute<GetTariffsQuery, any[]>(
      new GetTariffsQuery(),
    );
    return results.map((t) => new TariffEntity(t).toDto() as TariffResponse);
  }

  @Post('tariffs')
  @ApiOperation({ summary: 'Create a new school tariff' })
  @ApiResponse({ status: 201, type: TariffResponse })
  async createTariff(@Body() dto: CreateTariffDto): Promise<TariffResponse> {
    const result = await this.commandBus.execute<CreateTariffCommand, TariffEntity>(
      new CreateTariffCommand(dto.concept, dto.amount, dto.type, dto.level),
    );
    return result.toDto() as TariffResponse;
  }

  @Put('tariffs/:id')
  @ApiOperation({ summary: 'Update an existing tariff' })
  @ApiResponse({ status: 200, type: TariffResponse })
  async updateTariff(
    @Param('id') id: string,
    @Body() dto: UpdateTariffDto,
  ): Promise<TariffResponse> {
    const result = await this.commandBus.execute<UpdateTariffCommand, TariffEntity>(
      new UpdateTariffCommand(id, dto.concept, dto.amount, dto.type, dto.level),
    );
    return result.toDto() as TariffResponse;
  }

  @Delete('tariffs/:id')
  @ApiOperation({ summary: 'Delete a tariff concept' })
  @ApiResponse({ status: 200 })
  async deleteTariff(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute<DeleteTariffCommand, void>(
      new DeleteTariffCommand(id),
    );
  }

  // ─── CHARGES ───────────────────────────────────────────────────────────────

  @Get('charges')
  @ApiOperation({ summary: 'List all outstanding student charges' })
  @ApiResponse({ status: 200, type: [ChargeResponse] })
  async getCharges(
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ): Promise<ChargeResponse[]> {
    const results = await this.queryBus.execute<GetChargesQuery, any[]>(
      new GetChargesQuery(studentId, status),
    );
    return results.map((c) => new ChargeEntity(c).toDto() as ChargeResponse);
  }

  @Post('charges')
  @ApiOperation({ summary: 'Create a direct charge for a student' })
  @ApiResponse({ status: 201, type: ChargeResponse })
  async createCharge(@Body() dto: CreateChargeDto): Promise<ChargeResponse> {
    const parsedDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    const result = await this.commandBus.execute<CreateChargeCommand, ChargeEntity>(
      new CreateChargeCommand(dto.studentId, dto.tariffId, parsedDate),
    );
    return result.toDto() as ChargeResponse;
  }

  @Post('charges/bulk')
  @ApiOperation({ summary: 'Generate monthly bulk charges' })
  @ApiResponse({ status: 201, description: 'Number of charges successfully created.' })
  async generateBulkCharges(@Body() dto: GenerateBulkChargesDto): Promise<{ count: number }> {
    const parsedDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    const count = await this.commandBus.execute<GenerateBulkChargesCommand, number>(
      new GenerateBulkChargesCommand(dto.tariffId, parsedDate),
    );
    return { count };
  }

  @Delete('charges/:id')
  @ApiOperation({ summary: 'Delete a pending charge' })
  @ApiResponse({ status: 200 })
  async deleteCharge(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute<DeleteChargeCommand, void>(
      new DeleteChargeCommand(id),
    );
  }

  // ─── PAYMENTS ──────────────────────────────────────────────────────────────

  @Get('payments')
  @ApiOperation({ summary: 'List recent cash/bank transaction payments' })
  @ApiResponse({ status: 200, type: [PaymentResponse] })
  async getPayments(
    @Query('studentId') studentId?: string,
    @Query('chargeId') chargeId?: string,
  ): Promise<PaymentResponse[]> {
    const results = await this.queryBus.execute<GetPaymentsQuery, any[]>(
      new GetPaymentsQuery(studentId, chargeId),
    );
    return results.map((p) => new PaymentEntity(p).toDto() as PaymentResponse);
  }

  @Post('payments')
  @ApiOperation({ summary: 'Register a payment receipt against a charge' })
  @ApiResponse({ status: 201, type: PaymentResponse })
  async registerPayment(@Body() dto: RegisterPaymentDto): Promise<PaymentResponse> {
    const result = await this.commandBus.execute<RegisterPaymentCommand, PaymentEntity>(
      new RegisterPaymentCommand(dto.chargeId, dto.amount, dto.method),
    );
    return result.toDto() as PaymentResponse;
  }
}
