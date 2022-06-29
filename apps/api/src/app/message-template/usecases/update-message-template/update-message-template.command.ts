import {
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ChannelTypeEnum, IEmailBlock } from '@novu/shared';
import { CommandHelper } from '../../../shared/commands/command.helper';
import { EnvironmentWithUserCommand } from '../../../shared/commands/project.command';
import { ChannelCTACommand } from '../../../notification-template/usecases/create-notification-template';

export class UpdateMessageTemplateCommand extends EnvironmentWithUserCommand {
  static create(data: UpdateMessageTemplateCommand) {
    return CommandHelper.create<UpdateMessageTemplateCommand>(UpdateMessageTemplateCommand, data);
  }

  @IsDefined()
  @IsMongoId()
  templateId: string;

  @IsOptional()
  @IsEnum(ChannelTypeEnum)
  type: ChannelTypeEnum;

  @IsOptional()
  name?: string;

  @IsOptional()
  subject?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  content: string | IEmailBlock[];

  @IsOptional()
  contentType: 'editor' | 'customHtml';

  @IsOptional()
  @ValidateNested()
  cta: ChannelCTACommand;

  @IsMongoId()
  parentChangeId: string;
}
