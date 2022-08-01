import { MailGradient, MobileGradient, SmsGradient } from '../../../design-system/icons';
import { ChannelTypeEnum } from '@novu/shared';
import { DigestGradient } from '../../../design-system/icons/general/DigestGradient';

export enum StepTypeEnum {
  CHANNEL = 'channel',
  ACTION = 'action',
}

export const channels = [
  {
    tabKey: ChannelTypeEnum.IN_APP,
    label: 'In-App',
    description: 'Send notifications to the in-app notification center',
    Icon: MobileGradient,
    testId: 'inAppSelector',
    channelType: ChannelTypeEnum.IN_APP,
    type: StepTypeEnum.CHANNEL,
  },
  {
    tabKey: ChannelTypeEnum.EMAIL,
    label: 'Email',
    description: 'Send using one of our email integrations',
    Icon: MailGradient,
    testId: 'emailSelector',
    channelType: ChannelTypeEnum.EMAIL,
    type: StepTypeEnum.CHANNEL,
  },
  {
    tabKey: ChannelTypeEnum.SMS,
    label: 'SMS',
    description: "Send an SMS directly to the user's phone",
    Icon: SmsGradient,
    testId: 'smsSelector',
    channelType: ChannelTypeEnum.SMS,
    type: StepTypeEnum.CHANNEL,
  },
  {
    tabKey: ChannelTypeEnum.DIGEST,
    label: 'Digest',
    description: 'Aggregate events triggered to one notification',
    Icon: DigestGradient,
    testId: 'digestSelector',
    channelType: ChannelTypeEnum.DIGEST,
    type: StepTypeEnum.ACTION,
  },
  {
    tabKey: ChannelTypeEnum.DIRECT,
    label: 'Direct',
    description: 'Send a direct message',
    Icon: SmsGradient,
    testId: 'directSelector',
    channelType: ChannelTypeEnum.DIRECT,
  },
  {
    tabKey: ChannelTypeEnum.PUSH,
    label: 'Push',
    description: "Send an Push Notification to a user's device",
    Icon: MobileGradient,
    testId: 'pushSelector',
    channelType: ChannelTypeEnum.PUSH,
  },
];

export const getChannel = (channelKey: string) => {
  return channels.find((channel) => channel.tabKey === channelKey);
};
