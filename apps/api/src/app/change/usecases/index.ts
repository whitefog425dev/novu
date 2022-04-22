import { PromoteMessageTemplateChange } from './promote-message-template-change/promote-message-template-change';
import { PromoteNotificationTemplateChange } from './promote-notification-template-change/promote-notification-template-change';
import { PromoteChangeToEnvironment } from './promote-change-to-environment/promote-change-to-environment.usecase';
import { CreateChange } from './create-change.usecase';
import { ApplyChange } from './apply-change/apply-change.usecase';
import { GetChanges } from './get-changes/get-changes.usecase';
import { BulkApplyChange } from './bulk-apply-change/bulk-apply-change.usecase';
import { CountChanges } from './count-changes/count-changes.usecase';
export const USE_CASES = [
  CreateChange,
  PromoteChangeToEnvironment,
  PromoteNotificationTemplateChange,
  PromoteMessageTemplateChange,
  ApplyChange,
  GetChanges,
  BulkApplyChange,
  CountChanges,
];
