import { CreateIntegration } from './create-integration/create-integration.usecase';
import { GetIntegrations } from './get-integrations/get-integrations.usecase';
import { UpdateIntegration } from './update-integration/update-integration.usecase';
import { RemoveIntegration } from './remove-integration/remove-integration.usecase';
import { DeactivateSimilarChannelIntegrations } from './deactivate-integration/deactivate-integration.usecase';
import { GetActiveIntegrations } from './get-active-integration/get-active-integration.usecase';

export const USE_CASES = [
  CreateIntegration,
  GetIntegrations,
  GetActiveIntegrations,
  UpdateIntegration,
  RemoveIntegration,
  DeactivateSimilarChannelIntegrations,
];
