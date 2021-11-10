import { Body, ClassSerializerInterceptor, Controller, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { IJwtPayload, MemberRoleEnum } from '@notifire/shared';
import { UserSession } from '../shared/framework/user.decorator';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { Roles } from '../auth/framework/roles.decorator';
import { UpdateMailSettings } from './usecases/update-mail-settings/update-mail-settings.usecase';
import { UpdateMailSettingsCommand } from './usecases/update-mail-settings/update-mail-settings.command';
import { UpdateSmsSettings } from './usecases/update-sms-settings/update-sms-settings.usecase';
import { UpdateSmsSettingsCommand } from './usecases/update-sms-settings/update-sms-settings.command';

@Controller('/channels')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(
    private updateMailSettingsUsecase: UpdateMailSettings,
    private updateSmsSettingsUsecase: UpdateSmsSettings
  ) {}

  @Put('/email/settings')
  @Roles(MemberRoleEnum.ADMIN)
  updateMailSettings(@UserSession() user: IJwtPayload, @Body() body: { senderEmail: string; senderName: string }) {
    return this.updateMailSettingsUsecase.execute(
      UpdateMailSettingsCommand.create({
        userId: user._id,
        applicationId: user.applicationId,
        organizationId: user.organizationId,
        senderEmail: body.senderEmail,
        senderName: body.senderName,
      })
    );
  }

  @Put('/sms/settings')
  @Roles(MemberRoleEnum.ADMIN)
  updateSmsSettings(
    @UserSession() user: IJwtPayload,
    @Body() body: { twillio: { authToken: string; accountSid: string; phoneNumber: string } }
  ) {
    return this.updateSmsSettingsUsecase.execute(
      UpdateSmsSettingsCommand.create({
        userId: user._id,
        applicationId: user.applicationId,
        organizationId: user.organizationId,
        twillio: body.twillio,
      })
    );
  }
}
