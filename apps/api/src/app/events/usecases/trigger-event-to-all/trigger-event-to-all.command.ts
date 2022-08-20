import { IsDefined, IsObject, IsOptional, IsString } from 'class-validator';
import { EnvironmentWithUserCommand } from '../../../shared/commands/project.command';

export class TriggerEventToAllCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  @IsString()
  identifier: string;

  @IsDefined()
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  @IsString()
  @IsDefined()
  transactionId: string;

  @IsObject()
  @IsOptional()
  overrides: Record<string, Record<string, unknown>>;
}
