import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateSubscriber, CreateSubscriberCommand } from './usecases/create-subscriber';
import { UpdateSubscriber, UpdateSubscriberCommand } from './usecases/update-subscriber';
import { RemoveSubscriber, RemoveSubscriberCommand } from './usecases/remove-subscriber';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { UserSession } from '../shared/framework/user.decorator';
import { IJwtPayload } from '@novu/shared';
import {
  CreateSubscriberRequestDto,
  DeleteSubscriberResponseDto,
  SubscriberResponseDto,
  SubscribersResponseDto,
  UpdateSubscriberChannelRequestDto,
  UpdateSubscriberRequestDto,
} from './dtos';
import { UpdateSubscriberChannel, UpdateSubscriberChannelCommand } from './usecases/update-subscriber-channel';
import { GetSubscribers } from './usecases/get-subscribers/get-subscriber.usecase';
import { GetSubscribersCommand } from './usecases/get-subscribers';
import { GetSubscriber } from './usecases/get-subscriber/get-subscriber.usecase';
import { GetSubscriberCommand } from './usecases/get-subscriber';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/subscribers')
export class SubscribersController {
  constructor(
    private createSubscriberUsecase: CreateSubscriber,
    private updateSubscriberUsecase: UpdateSubscriber,
    private updateSubscriberChannelUsecase: UpdateSubscriberChannel,
    private removeSubscriberUsecase: RemoveSubscriber,
    private getSubscribersUsecase: GetSubscribers,
    private getSubscriberUseCase: GetSubscriber
  ) {}

  @Get('')
  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: SubscribersResponseDto,
  })
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
  @ApiResponse({
    type: SubscriberResponseDto,
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
  @ApiResponse({
    type: SubscriberResponseDto,
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
  @ApiResponse({
    type: SubscriberResponseDto,
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
  @ApiResponse({
    type: SubscriberResponseDto,
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
  @ApiResponse({
    type: DeleteSubscriberResponseDto,
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
}
