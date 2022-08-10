import { IsDefined, IsObject, IsOptional, IsString } from 'class-validator';
import { TriggerRecipientsType } from '../../interfaces';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class SubscriberPayloadDto {
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  avatar?: string;
}

@ApiExtraModels(SubscriberPayloadDto)
export class TriggerEventRequestDto {
  @ApiProperty({
    description: 'Name of your notification',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty()
  @IsObject()
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  @ApiProperty()
  @IsObject()
  @IsOptional()
  overrides: Record<string, Record<string, unknown>>;

  @ApiProperty({
    oneOf: [
      {
        $ref: getSchemaPath(SubscriberPayloadDto),
      },
      {
        type: '[SubscriberPayloadDto]',
        description: 'List of your users info where you like to send notification to',
      },
      { type: 'string', description: 'Subscriber id of your user' },
      {
        type: '[string]',
        description: 'List of subscriber ids of your users',
      },
    ],
  })
  @IsDefined()
  to: TriggerRecipientsType; // eslint-disable-line @typescript-eslint/no-explicit-any

  @ApiProperty()
  @IsString()
  @IsOptional()
  transactionId: string;
}
