import { GetOrganizationData } from './get-organization-data/get-organization-data.usecase';
import { MarkMessageAsSeen } from './mark-message-as-seen/mark-message-as-seen.usecase';
import { GetUnseenCount } from './get-unseen-count/get-unseen-count.usecase';
import { GetNotificationsFeed } from './get-notifications-feed/get-notifications-feed.usecase';
import { InitializeSession } from './initialize-session/initialize-session.usecase';
import { GetWidgetSettings } from './get-widget-settings/get-widget-settings.usecase';
import { MarkActionAsDone } from './mark-action-as-done/mark-action-as-done.usecause';

export const USE_CASES = [
  GetOrganizationData,
  MarkMessageAsSeen,
  MarkActionAsDone,
  GetUnseenCount,
  GetNotificationsFeed,
  InitializeSession,
  GetWidgetSettings,
  //
];
