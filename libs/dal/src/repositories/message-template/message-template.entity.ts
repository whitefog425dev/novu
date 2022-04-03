import { ChannelCTATypeEnum, ChannelTypeEnum } from '@novu/shared';

export class MessageTemplateEntity {
  _id?: string;

  _applicationId: string;

  _organizationId: string;

  _creatorId: string;

  type: ChannelTypeEnum;

  content: string | IEmailBlock[];

  contentType?: 'editor' | 'customHtml';

  subject?: string;

  name?: string;

  cta?: {
    type: ChannelCTATypeEnum;
    data: {
      url?: string;
    };
  };
}

export class IEmailBlock {
  type: 'button' | 'text';

  content: string;

  url?: string;

  styles?: {
    textDirection?: 'rtl' | 'ltr';
  };
}
