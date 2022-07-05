import { IsArray, IsDefined, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommandHelper } from '../../../shared/commands/command.helper';
import { EnvironmentWithUserCommand } from '../../../shared/commands/project.command';
import { NotificationStepDto } from '../../dto';

export class UpdateNotificationTemplateCommand extends EnvironmentWithUserCommand {
  static create(data: UpdateNotificationTemplateCommand) {
    return CommandHelper.create<UpdateNotificationTemplateCommand>(UpdateNotificationTemplateCommand, data);
  }

  @IsDefined()
  @IsMongoId()
  templateId: string;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsMongoId({
    message: 'Bad group id name',
  })
  notificationGroupId: string;

  @IsArray()
  @ValidateNested()
  @IsOptional()
  steps: NotificationStepDto[];
}
