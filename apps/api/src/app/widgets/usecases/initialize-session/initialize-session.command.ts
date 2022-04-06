import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class InitializeSessionCommand {
  static create(data: InitializeSessionCommand) {
    return CommandHelper.create<InitializeSessionCommand>(InitializeSessionCommand, data);
  }

  @IsDefined()
  @IsString()
  subscriberId: string;

  @IsDefined()
  @IsString()
  environmentIdentifier: string;

  firstName?: string;

  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
