import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { WidgetsController } from './widgets.controller';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [SharedModule, SubscribersModule, AuthModule],
  providers: [...USE_CASES],
  exports: [],
  controllers: [WidgetsController],
})
export class WidgetsModule {}
