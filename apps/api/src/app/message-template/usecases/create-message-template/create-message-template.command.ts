import { IsDefined, IsEnum, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ChannelTypeEnum, IEmailBlock } from '@novu/shared';
import { CommandHelper } from '../../../shared/commands/command.helper';
import { EnvironmentWithUserCommand } from '../../../shared/commands/project.command';
import { ChannelCTADto } from '../../../notification-template/dto/create-notification-template.dto';

export class CreateMessageTemplateCommand extends EnvironmentWithUserCommand {
  static create(data: CreateMessageTemplateCommand) {
    return CommandHelper.create<CreateMessageTemplateCommand>(CreateMessageTemplateCommand, data);
  }

  @IsDefined()
  @IsEnum(ChannelTypeEnum)
  type: ChannelTypeEnum;

  @IsOptional()
  name?: string;

  @IsOptional()
  subject?: string;

  @IsDefined()
  content: string | IEmailBlock[];

  @IsOptional()
  contentType: 'editor' | 'customHtml';

  @IsOptional()
  @ValidateNested()
  cta: ChannelCTADto;

  @IsMongoId()
  parentChangeId: string;
}
