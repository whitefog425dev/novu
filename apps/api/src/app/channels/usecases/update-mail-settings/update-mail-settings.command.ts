import { IsDefined, IsEmail } from 'class-validator';
import { CommandHelper } from '../../../shared/commands/command.helper';
import { EnvironmentWithUserCommand } from '../../../shared/commands/project.command';

export class UpdateMailSettingsCommand extends EnvironmentWithUserCommand {
  static create(data: UpdateMailSettingsCommand) {
    return CommandHelper.create<UpdateMailSettingsCommand>(UpdateMailSettingsCommand, data);
  }

  @IsDefined()
  @IsEmail()
  senderEmail: string;

  @IsDefined()
  senderName: string;
}
