import {
  ArgumentMetadata,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateSubscriber, CreateSubscriberCommand } from './usecases/create-subscriber';
import { UpdateSubscriber, UpdateSubscriberCommand } from './usecases/update-subscriber';
import { RemoveSubscriber, RemoveSubscriberCommand } from './usecases/remove-subscriber';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { UserSession } from '../shared/framework/user.decorator';
import { ButtonTypeEnum, IJwtPayload, MessageActionStatusEnum } from '@novu/shared';
import {
  CreateSubscriberRequestDto,
  DeleteSubscriberResponseDto,
  SubscriberResponseDto,
  SubscribersResponseDto,
  UpdateSubscriberChannelRequestDto,
  UpdateSubscriberRequestDto,
} from './dtos';
import { UpdateSubscriberChannel, UpdateSubscriberChannelCommand } from './usecases/update-subscriber-channel';
import { GetSubscribers } from './usecases/get-subscribers';
import { GetSubscribersCommand } from './usecases/get-subscribers';
import { GetSubscriber, GetSubscriberCommand } from './usecases/get-subscriber';
import { ApiTags, ApiOkResponse, ApiOperation, ApiCreatedResponse, ApiQuery } from '@nestjs/swagger';
import { GetPreferencesCommand } from './usecases/get-preferences/get-preferences.command';
import { GetPreferences } from './usecases/get-preferences/get-preferences.usecase';
import { UpdatePreference } from './usecases/update-preference/update-preference.usecase';
import { UpdateSubscriberPreferenceCommand } from './usecases/update-subscriber-preference';
import { UpdateSubscriberPreferenceResponseDto } from '../widgets/dtos/update-subscriber-preference-response.dto';
import { UpdateSubscriberPreferenceRequestDto } from '../widgets/dtos/update-subscriber-preference-request.dto';
import { MessageResponseDto } from '../widgets/dtos/message-response.dto';
import { UnseenCountResponse } from '../widgets/dtos/unseen-count-response.dto';
import { GetUnseenCountCommand } from '../widgets/usecases/get-unseen-count/get-unseen-count.command';
import { MessageEntity } from '@novu/dal';
import { MarkMessageAsSeenCommand } from '../widgets/usecases/mark-message-as-seen/mark-message-as-seen.command';
import { UpdateMessageActionsCommand } from '../widgets/usecases/mark-action-as-done/update-message-actions.command';
import { GetNotificationsFeedCommand } from '../widgets/usecases/get-notifications-feed/get-notifications-feed.command';
import { GetNotificationsFeed } from '../widgets/usecases/get-notifications-feed/get-notifications-feed.usecase';
import { GetUnseenCount } from '../widgets/usecases/get-unseen-count/get-unseen-count.usecase';
import { MarkMessageAsSeen } from '../widgets/usecases/mark-message-as-seen/mark-message-as-seen.usecase';
import { UpdateMessageActions } from '../widgets/usecases/mark-action-as-done/update-message-actions.usecause';
import { initializeSeenParam } from '../widgets/widgets.controller';

@Controller('/subscribers')
@ApiTags('Subscribers')
export class SubscribersController {
  constructor(
    private createSubscriberUsecase: CreateSubscriber,
    private updateSubscriberUsecase: UpdateSubscriber,
    private updateSubscriberChannelUsecase: UpdateSubscriberChannel,
    private removeSubscriberUsecase: RemoveSubscriber,
    private getSubscriberUseCase: GetSubscriber,
    private getSubscribersUsecase: GetSubscribers,
    private getPreferenceUsecase: GetPreferences,
    private updatePreferenceUsecase: UpdatePreference,
    private getNotificationsFeedUsecase: GetNotificationsFeed,
    private genUnseenCountUsecase: GetUnseenCount,
    private markMessageAsSeenUsecase: MarkMessageAsSeen,
    private updateMessageActionsUsecase: UpdateMessageActions
  ) {}

  @Get('')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: SubscribersResponseDto,
  })
  @ApiOperation({
    summary: 'Get subscribers',
    description: 'Returns a list of subscribers, could paginated using the `page` query parameter',
  })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'The page to fetch, defaults to 0' })
  async getSubscribers(@UserSession() user: IJwtPayload, @Query('page') page = 0): Promise<SubscribersResponseDto> {
    return await this.getSubscribersUsecase.execute(
      GetSubscribersCommand.create({
        organizationId: user.organizationId,
        environmentId: user.environmentId,
        page: page ? Number(page) : 0,
      })
    );
  }

  @Get('/:subscriberId')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: SubscriberResponseDto,
  })
  @ApiOperation({
    summary: 'Get subscriber',
    description: 'Get subscriber by your internal id used to identify the subscriber',
  })
  async getSubscriber(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string
  ): Promise<SubscriberResponseDto> {
    return await this.getSubscriberUseCase.execute(
      GetSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
      })
    );
  }

  @Post('/')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: SubscriberResponseDto,
  })
  @ApiOperation({
    summary: 'Create subscriber',
    description:
      'Creates a subscriber entity, in the Novu platform. ' +
      'The subscriber will be later used to receive notifications, and access notification feeds. ' +
      'Communication credentials such as email, phone number, and 3 rd party credentials i.e slack tokens could be later associated to this entity.',
  })
  async createSubscriber(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateSubscriberRequestDto
  ): Promise<SubscriberResponseDto> {
    return await this.createSubscriberUsecase.execute(
      CreateSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId: body.subscriberId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        avatar: body.avatar,
      })
    );
  }

  @Put('/:subscriberId')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: SubscriberResponseDto,
  })
  @ApiOperation({
    summary: 'Update subscriber',
    description: 'Used to update the subscriber entity with new information',
  })
  async updateSubscriber(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string,
    @Body() body: UpdateSubscriberRequestDto
  ): Promise<SubscriberResponseDto> {
    return await this.updateSubscriberUsecase.execute(
      UpdateSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        avatar: body.avatar,
      })
    );
  }

  @Put('/:subscriberId/credentials')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: SubscriberResponseDto,
  })
  @ApiOperation({
    summary: 'Update subscriber credentials',
    description: 'Subscriber credentials associated to the delivery methods such as slack and push tokens.',
  })
  async updateSubscriberChannel(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string,
    @Body() body: UpdateSubscriberChannelRequestDto
  ): Promise<SubscriberResponseDto> {
    return await this.updateSubscriberChannelUsecase.execute(
      UpdateSubscriberChannelCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
        providerId: body.providerId,
        credentials: body.credentials,
      })
    );
  }

  @Delete('/:subscriberId')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: DeleteSubscriberResponseDto,
  })
  @ApiOperation({
    summary: 'Delete subscriber',
    description: 'Deletes a subscriber entity from the Novu platform',
  })
  async removeSubscriber(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string
  ): Promise<DeleteSubscriberResponseDto> {
    return await this.removeSubscriberUsecase.execute(
      RemoveSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
      })
    );
  }

  @Get('/:subscriberId/preferences')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: [UpdateSubscriberPreferenceResponseDto],
  })
  @ApiOperation({
    summary: 'Get subscriber preferences',
  })
  async getSubscriberPreference(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string
  ): Promise<UpdateSubscriberPreferenceResponseDto[]> {
    const command = GetPreferencesCommand.create({
      organizationId: user.organizationId,
      subscriberId: subscriberId,
      environmentId: user.environmentId,
    });

    return await this.getPreferenceUsecase.execute(command);
  }

  @Patch('/:subscriberId/preferences/:templateId')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: UpdateSubscriberPreferenceResponseDto,
  })
  @ApiOperation({
    summary: 'Update subscriber preference',
  })
  async updateSubscriberPreference(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string,
    @Param('templateId') templateId: string,
    @Body() body: UpdateSubscriberPreferenceRequestDto
  ): Promise<UpdateSubscriberPreferenceResponseDto> {
    const command = UpdateSubscriberPreferenceCommand.create({
      organizationId: user.organizationId,
      subscriberId: subscriberId,
      environmentId: user.environmentId,
      templateId: templateId,
      channel: body.channel,
      enabled: body.enabled,
    });

    return await this.updatePreferenceUsecase.execute(command);
  }

  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @Get('/:subscriberId/notifications/feed')
  @ApiOperation({
    summary: 'Get a notification feed for a particular subscriber',
  })
  @ApiOkResponse({
    type: [MessageResponseDto],
  })
  @ApiQuery({
    name: 'seen',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  async getNotificationsFeed(
    @UserSession() user: IJwtPayload,
    @Param('subscriberId') subscriberId: string,
    @Query('page') page?: string,
    @Query('feedIdentifier') feedId?: string,
    @Query('seen') seen?: string
  ) {
    const isSeen = initializeSeenParam(seen);

    let feedsQuery: string[];
    if (feedId) {
      feedsQuery = Array.isArray(feedId) ? feedId : [feedId];
    }

    const command = GetNotificationsFeedCommand.create({
      organizationId: user.organizationId,
      environmentId: user.environmentId,
      subscriberId: subscriberId,
      page: page != null ? parseInt(page) : undefined,
      feedId: feedsQuery,
      seen: isSeen,
    });

    return await this.getNotificationsFeedUsecase.execute(command);
  }

  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @Get('/:subscriberId/notifications/unseen')
  @ApiOkResponse({
    type: UnseenCountResponse,
  })
  @ApiOperation({
    summary: 'Get the unseen notification count for subscribers feed',
  })
  async getUnseenCount(
    @UserSession() user: IJwtPayload,
    @Query('feedIdentifier') feedId: string[] | string,
    @Query('seen') seen: boolean,
    @Param('subscriberId') subscriberId: string
  ): Promise<UnseenCountResponse> {
    let feedsQuery: string[];
    if (feedId) {
      feedsQuery = Array.isArray(feedId) ? feedId : [feedId];
    }

    const command = GetUnseenCountCommand.create({
      organizationId: user.organizationId,
      subscriberId: subscriberId,
      environmentId: user.environmentId,
      feedId: feedsQuery,
      seen,
    });

    return await this.genUnseenCountUsecase.execute(command);
  }

  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @Post('/:subscriberId/messages/:messageId/seen')
  @ApiOperation({
    summary: 'Mark a subscriber feed message as seen',
  })
  @ApiCreatedResponse({
    type: MessageResponseDto,
  })
  async markMessageAsSeen(
    @UserSession() user: IJwtPayload,
    @Param('messageId') messageId: string,
    @Param('subscriberId') subscriberId: string
  ): Promise<MessageEntity> {
    const command = MarkMessageAsSeenCommand.create({
      organizationId: user.organizationId,
      environmentId: user.environmentId,
      subscriberId: subscriberId,
      messageId,
    });

    return await this.markMessageAsSeenUsecase.execute(command);
  }

  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @Post('/:subscriberId/messages/:messageId/actions/:type')
  @ApiOperation({
    summary: 'Mark message action as seen',
  })
  @ApiCreatedResponse({
    type: MessageResponseDto,
  })
  async markActionAsSeen(
    @UserSession() user: IJwtPayload,
    @Param('messageId') messageId: string,
    @Param('type') type: ButtonTypeEnum,
    @Body() body: { payload: any; status: MessageActionStatusEnum }, // eslint-disable-line @typescript-eslint/no-explicit-any
    @Param('subscriberId') subscriberId: string
  ): Promise<MessageEntity> {
    return await this.updateMessageActionsUsecase.execute(
      UpdateMessageActionsCommand.create({
        organizationId: user.organizationId,
        environmentId: user.environmentId,
        subscriberId: subscriberId,
        messageId,
        type,
        payload: body.payload,
        status: body.status,
      })
    );
  }
}
