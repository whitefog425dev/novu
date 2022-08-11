import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EnvironmentCommand } from '../../../shared/commands/project.command';
import { ChannelPreference } from '../../../widgets/dtos/update-subscriber-preference-request.dto';

export class UpdatePreferenceCommand extends EnvironmentCommand {
  @IsString()
  @IsDefined()
  subscriberId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ValidateNested()
  @IsOptional()
  channel?: ChannelPreference;
}
