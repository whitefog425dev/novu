import { GetActivityStats } from './get-activity-stats/get-activity-stats.usecase';
import { GetActivityFeed } from './get-activity-feed/get-activity-feed.usecase';
import { GetActivityGraphStats } from './get-acticity-graph-states/get-acticity-graph-states.usecase';

export const USE_CASES = [
  GetActivityStats,
  GetActivityGraphStats,
  GetActivityFeed,
  //
];
