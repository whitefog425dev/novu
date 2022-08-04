import { Module } from '@nestjs/common';
import { EXPORT_USE_CASES, USE_CASES } from './usecases';
import { WidgetsController } from './widgets.controller';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [SharedModule, SubscribersModule, AuthModule],
  providers: [...USE_CASES],
  exports: [...EXPORT_USE_CASES],
  controllers: [WidgetsController],
})
export class WidgetsModule {}
