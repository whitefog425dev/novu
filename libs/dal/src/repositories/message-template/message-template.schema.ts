import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { MessageTemplateEntity } from './message-template.entity';

const messageTemplateSchema = new Schema(
  {
    type: {
      type: Schema.Types.String,
    },
    active: {
      type: Schema.Types.Boolean,
      default: true,
    },
    name: Schema.Types.String,
    subject: Schema.Types.String,
    content: Schema.Types.Mixed,
    contentType: Schema.Types.String,
    title: Schema.Types.String,
    cta: {
      type: {
        type: Schema.Types.String,
      },
      data: Schema.Types.Mixed,
      action: Schema.Types.Mixed,
    },
    _environmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Environment',
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    _feedId: {
      type: Schema.Types.ObjectId,
      ref: 'Feed',
    },
    _parentId: {
      type: Schema.Types.ObjectId,
      ref: 'NotificationTemplate',
    },
  },
  schemaOptions
);

messageTemplateSchema.index({
  _organizationId: 1,
  'triggers.identifier': 1,
});

interface IMessageTemplateDocument extends MessageTemplateEntity, Document {
  _id: never;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MessageTemplate =
  mongoose.models.MessageTemplate || mongoose.model<IMessageTemplateDocument>('MessageTemplate', messageTemplateSchema);
