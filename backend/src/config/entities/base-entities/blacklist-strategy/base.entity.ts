import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, instanceToPlain } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { BaseComposedEntityType, BaseEntityType } from '../base-entity.types';
import {
  BaseEntitiesMethods,
  ExtractNotUndefinedFieldsParams,
} from '../base-entity-methods.interface';
import {
  DomainEvent,
  IDomainEventsEntity,
} from '../../../ddd/base.domain-events.interface.ddd';

export abstract class BaseComposedIdEntity
  implements BaseComposedEntityType, BaseEntitiesMethods
{
  @ApiProperty({
    description: 'Indicates whether the entity is active or not',
    example: true,
    required: true,
  })
  public isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when the entity was created',
    example: new Date().toISOString(),
    required: true,
  })
  public readonly createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the entity was last updated',
    example: new Date().toISOString(),
    required: true,
  })
  public updatedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the entity was deleted (for soft delete)',
    example: null,
    required: false,
  })
  public deletedAt?: Date | null;

  constructor(partial: Partial<BaseComposedEntityType>) {
    Object.assign(this, partial);
  }

  @Exclude()
  get isPersisted(): boolean {
    return this.createdAt !== undefined && this.updatedAt !== undefined;
  }

  touch() {
    this.updatedAt = new Date();
  }

  @Exclude()
  get isTouched(): boolean {
    return this.createdAt !== this.updatedAt;
  }

  softDelete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.deletedAt = undefined;
  }

  toggleActive(): void {
    if (this.isActive && this.isActive === true) {
      this.softDelete();
    } else {
      this.activate();
    }
  }

  getNotUndefinedFields<T extends BaseComposedEntityType>({
    pick,
  }: ExtractNotUndefinedFieldsParams<T> = {}): Record<keyof T, unknown> {
    const result: Record<keyof T, unknown> = {} as Record<keyof T, unknown>;
    (pick ?? (Object.keys(this) as Array<keyof T>)).forEach((key) => {
      const value = (this as unknown as T)[key];
      if (value !== undefined) {
        result[key] = value;
      }
    });
    return result;
  }

  toDto<
    TCustomEntityDto extends BaseComposedIdEntity,
    TGroups extends string = string,
  >(groups?: TGroups | TGroups[]) {
    return instanceToPlain(this, {
      excludeExtraneousValues: false,
      groups: groups ? (Array.isArray(groups) ? groups : [groups]) : undefined,
    }) as TCustomEntityDto;
  }
}

export abstract class BaseEntity<TEntityDto extends object = object>
  extends BaseComposedIdEntity
  implements BaseEntityType, BaseEntitiesMethods
{
  @ApiProperty({
    description: 'Unique identifier for the entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  public readonly id: string;

  constructor(partial: Partial<BaseEntityType>) {
    super(partial);
    Object.assign(this, partial);
  }

  @Exclude()
  get isPersisted(): boolean {
    return (
      this.id !== undefined &&
      this.createdAt !== undefined &&
      this.updatedAt !== undefined
    );
  }

  toDto<
    TGroups extends string = string,
    TCustomEntityDto extends object = TEntityDto,
  >(groups?: TGroups | TGroups[]) {
    return instanceToPlain(this, {
      excludeExtraneousValues: false,
      groups: groups ? (Array.isArray(groups) ? groups : [groups]) : undefined,
    }) as TCustomEntityDto;
  }
}

export abstract class BaseAggregateRootEntity<
  TEntityDto extends object = object,
  TDomainEvent extends DomainEvent = DomainEvent<string, object, string>,
  EventBase extends IEvent = IEvent,
>
  extends AggregateRoot<EventBase>
  implements
    BaseEntityType,
    IDomainEventsEntity<TDomainEvent>,
    BaseEntitiesMethods
{
  @ApiProperty({
    description: 'Unique identifier for the entity',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  public readonly id: string;
  @ApiProperty({
    description: 'Indicates whether the entity is active or not',
    example: true,
    required: true,
  })
  public isActive: boolean;
  @ApiProperty({
    description: 'Timestamp when the entity was created',
    example: new Date().toISOString(),
    required: true,
  })
  public readonly createdAt: Date;
  @ApiProperty({
    description: 'Timestamp when the entity was last updated',
    example: new Date().toISOString(),
    required: true,
  })
  public updatedAt: Date;
  @ApiProperty({
    description: 'Timestamp when the entity was deleted (for soft delete)',
    example: null,
    required: false,
  })
  public deletedAt?: Date | null;

  #domainEvents: TDomainEvent[] = [];

  public addDomainEvent(event: TDomainEvent): void {
    this.domainEvents.push(event);
  }

  public set domainEvents(events: TDomainEvent[]) {
    this.#domainEvents = events;
  }

  public pullDomainEvents(): TDomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  @Exclude()
  public get domainEvents(): TDomainEvent[] {
    return this.#domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }

  doExistDomainEvent(eventType: Pick<TDomainEvent, 'eventType'>): boolean {
    return this.domainEvents.some(
      (event) => event.eventType === eventType.eventType,
    );
  }

  @Exclude()
  get isPersisted(): boolean {
    return (
      this.id !== undefined &&
      this.createdAt !== undefined &&
      this.updatedAt !== undefined
    );
  }

  touch(): void {
    this.updatedAt = new Date();
  }

  @Exclude()
  get isTouched(): boolean {
    return this.createdAt !== this.updatedAt;
  }

  softDelete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.deletedAt = undefined;
  }

  toggleActive(): void {
    if (this.isActive && this.isActive === true) {
      this.softDelete();
    } else {
      this.activate();
    }
  }

  getNotUndefinedFields<T extends BaseComposedEntityType>({
    pick,
  }: ExtractNotUndefinedFieldsParams<T> = {}): Record<keyof T, unknown> {
    const result: Record<keyof T, unknown> = {} as Record<keyof T, unknown>;
    (pick ?? (Object.keys(this) as Array<keyof T>)).forEach((key) => {
      const value = (this as unknown as T)[key];
      if (value !== undefined) {
        result[key] = value;
      }
    });
    return result;
  }

  constructor(
    partial: Partial<
      BaseAggregateRootEntity<TEntityDto, TDomainEvent, EventBase>
    >,
  ) {
    super();
    Object.assign(this, partial);
  }

  toDto<
    TGroups extends string = string,
    TCustomEntityDto extends object = TEntityDto,
  >(groups?: TGroups | TGroups[]) {
    return instanceToPlain(this, {
      excludeExtraneousValues: false,
      groups: groups ? (Array.isArray(groups) ? groups : [groups]) : undefined,
    }) as TCustomEntityDto;
  }
}
