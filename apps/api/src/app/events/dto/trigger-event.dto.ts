import { IsDefined, IsObject, IsString } from 'class-validator';
import { TriggerRecipientsType } from '@novu/node';

export class TriggerEventDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsObject()
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  @IsDefined()
  to: TriggerRecipientsType; // eslint-disable-line @typescript-eslint/no-explicit-any
}
