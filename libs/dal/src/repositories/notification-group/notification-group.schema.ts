import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { NotificationGroupEntity } from './notification-group.entity';

// eslint-disable-next-line @typescript-eslint/naming-convention
const NotificationGroupSchema = new Schema(
  {
    name: Schema.Types.String,
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
    },
    _applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      index: true,
    },
  },
  schemaOptions
);

interface INotificationGroupDocument extends NotificationGroupEntity, Document {
  _id: never;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const NotificationGroup =
  mongoose.models.NotificationGroup ||
  mongoose.model<INotificationGroupDocument>('NotificationGroup', NotificationGroupSchema);
