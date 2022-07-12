import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentRepository, SubscriberEntity, FeedRepository, FeedEntity } from '@novu/dal';
import { AuthService } from '../../../auth/services/auth.service';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { CreateSubscriber, CreateSubscriberCommand } from '../../../subscribers/usecases/create-subscriber';
import { InitializeSessionCommand } from './initialize-session.command';
import { createHmac } from 'crypto';
import { AnalyticsService } from '../../../shared/services/analytics/analytics.service';
import { ANALYTICS_SERVICE } from '../../../shared/shared.module';

@Injectable()
export class InitializeSession {
  constructor(
    private environmentRepository: EnvironmentRepository,
    private createSubscriber: CreateSubscriber,
    private authService: AuthService,
    private feedRepository: FeedRepository,
    @Inject(ANALYTICS_SERVICE) private analyticsService: AnalyticsService
  ) {}

  async execute(command: InitializeSessionCommand): Promise<{
    token: string;
    profile: Partial<SubscriberEntity>;
    feeds: Partial<FeedEntity>[];
  }> {
    const environment = await this.environmentRepository.findEnvironmentByIdentifier(command.applicationIdentifier);

    if (!environment) {
      throw new ApiException('Please provide a valid app identifier');
    }

    if (environment.widget.notificationCenterEncryption) {
      validateNotificationCenterEncryption(environment, command);
    }

    const commandos = CreateSubscriberCommand.create({
      environmentId: environment._id,
      organizationId: environment._organizationId,
      subscriberId: command.subscriberId,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
    });

    const subscriber = await this.createSubscriber.execute(commandos);

    const feeds = await this.feedRepository.find(
      {
        _environmentId: environment._id,
      },
      '_id name'
    );

    this.analyticsService.track('Initialize Widget Session - [Notification Center]', environment._organizationId, {
      _organization: environment._organizationId,
      environmentName: environment.name,
      _subscriber: subscriber._id,
    });

    return {
      token: await this.authService.getSubscriberWidgetToken(subscriber),
      profile: {
        _id: subscriber._id,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        phone: subscriber.phone,
      },
      feeds,
    };
  }
}

function validateNotificationCenterEncryption(environment, command: InitializeSessionCommand) {
  const hmacHash = createHmac('sha256', environment.apiKeys[0].key).update(command.subscriberId).digest('hex');

  if (hmacHash !== command.hmacHash) {
    throw new ApiException('Please provide a valid HMAC hash');
  }
}
