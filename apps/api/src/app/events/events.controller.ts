import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { IJwtPayload } from '@novu/shared';
import { v4 as uuidv4 } from 'uuid';
import { TriggerEvent, TriggerEventCommand } from './usecases/trigger-event';
import { UserSession } from '../shared/framework/user.decorator';
import { TriggerEventDto } from './dto/trigger-event.dto';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { ISubscribersDefine } from '@novu/node';
import { CancelDigest } from './usecases/cancel-digest/cancel-digest.usecase';
import { CancelDigestCommand } from './usecases/cancel-digest/cancel-digest.command';

@Controller('events')
export class EventsController {
  constructor(private triggerEvent: TriggerEvent, private cancelDigestUsecase: CancelDigest) {}

  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @Post('/trigger')
  trackEvent(@UserSession() user: IJwtPayload, @Body() body: TriggerEventDto) {
    const mappedSubscribers = this.mapSubscribers(body);

    return this.triggerEvent.execute(
      TriggerEventCommand.create({
        userId: user._id,
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        identifier: body.name,
        payload: body.payload,
        to: mappedSubscribers,
        transactionId: body.transactionId || uuidv4(),
      })
    );
  }

  @ExternalApiAccessible()
  @UseGuards(JwtAuthGuard)
  @Delete('/trigger/:transactionId')
  async cancelDigest(
    @UserSession() user: IJwtPayload,
    @Param('transactionId') transactionId: string
  ): Promise<boolean> {
    return await this.cancelDigestUsecase.execute(
      CancelDigestCommand.create({
        userId: user._id,
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        transactionId,
      })
    );
  }

  private mapSubscribers(body: TriggerEventDto): ISubscribersDefine[] {
    const subscribers = Array.isArray(body.to) ? body.to : [body.to];

    return subscribers.map((subscriber) => {
      if (typeof subscriber === 'string') {
        return {
          subscriberId: subscriber,
        };
      } else {
        return subscriber;
      }
    });
  }
}
