import {
  mailgunConfig,
  mailjetConfig,
  mailJsConfig,
  mandrillConfig,
  nexmoConfig,
  nodemailerConfig,
  plivoConfig,
  postmarkConfig,
  sendgridConfig,
  sendinblueConfig,
  sesConfig,
  sms77Config,
  snsConfig,
  telnyxConfig,
  twilioConfig,
  termiiConfig,
  netCoreConfig,
  gupshupConfig,
} from './provider-credentials';
import { ChannelTypeEnum } from '../../entities/message-template';
import { IProviderConfig } from './provider.interface';

export const providers: IProviderConfig[] = [
  {
    id: 'emailjs',
    displayName: 'Email.js',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mailJsConfig,
    docReference: 'https://www.emailjs.com/docs/',
    logoFileName: { light: 'emailjs.svg', dark: 'emailjs.svg' },
  },
  {
    id: 'mailgun',
    displayName: 'Mailgun',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mailgunConfig,
    docReference: 'https://documentation.mailgun.com/en/latest/',
    logoFileName: { light: 'mailgun.svg', dark: 'mailgun.svg' },
  },
  {
    id: 'mailjet',
    displayName: 'Mailjet',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mailjetConfig,
    docReference: 'https://documentation.mailjet.com/hc/en-us/categories/360003942934-Mailjet-Documentation-Center-',
    logoFileName: { light: 'mailjet.png', dark: 'mailjet.png' },
  },
  {
    id: 'mandrill',
    displayName: 'Mandrill',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mandrillConfig,
    docReference: 'https://mandrillapp.com/docs/?_ga=1.34114145.1141874178.1422518109',
    logoFileName: { light: 'mandrill.svg', dark: 'mandrill.svg' },
  },
  {
    id: 'nodemailer',
    displayName: 'Nodemailer',
    channel: ChannelTypeEnum.EMAIL,
    credentials: nodemailerConfig,
    docReference: 'https://nodemailer.com/about/',
    logoFileName: { light: 'nodemailer.svg', dark: 'nodemailer.svg' },
  },
  {
    id: 'postmark',
    displayName: 'Postmark',
    channel: ChannelTypeEnum.EMAIL,
    credentials: postmarkConfig,
    docReference: 'https://postmarkapp.com/developer',
    logoFileName: { light: 'postmark.png', dark: 'postmark.png' },
  },
  {
    id: 'sendgrid',
    displayName: 'SendGrid',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sendgridConfig,
    docReference: 'https://docs.sendgrid.com/',
    logoFileName: { light: 'sendgrid.png', dark: 'sendgrid.png' },
  },
  {
    id: 'netcore',
    displayName: 'NetCore',
    channel: ChannelTypeEnum.EMAIL,
    credentials: netCoreConfig,
    docReference: 'https://netcorecloud.com/email/email-api/',
    logoFileName: { light: 'netcore.png', dark: 'netcore.png' },
  },
  {
    id: 'sendinblue',
    displayName: 'Sendinblue',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sendinblueConfig,
    docReference: 'https://www.sendinblue.com/',
    logoFileName: { light: 'sendinblue.png', dark: 'sendinblue.png' },
  },
  {
    id: 'ses',
    displayName: 'SES',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sesConfig,
    docReference: 'https://docs.aws.amazon.com/ses/index.html',
    logoFileName: { light: 'ses.svg', dark: 'ses.svg' },
  },
  {
    id: 'nexmo',
    displayName: 'Nexmo',
    channel: ChannelTypeEnum.SMS,
    credentials: nexmoConfig,
    docReference: 'https://developer.nexmo.com/api/sms?theme=dark',
    logoFileName: { light: 'nexmo.png', dark: 'nexmo.png' },
  },
  {
    id: 'plivo',
    displayName: 'Plivo',
    channel: ChannelTypeEnum.SMS,
    credentials: plivoConfig,
    docReference: 'https://www.plivo.com/docs/',
    logoFileName: { light: 'plivo.png', dark: 'plivo.png' },
  },

  {
    id: 'sms77',
    displayName: 'sms77',
    channel: ChannelTypeEnum.SMS,
    credentials: sms77Config,
    docReference: 'https://www.sms77.io/de/docs/gateway/http-api/',
    logoFileName: { light: 'sms77.svg', dark: 'sms77.svg' },
  },
  {
    id: 'termii',
    displayName: 'Termii',
    channel: ChannelTypeEnum.SMS,
    credentials: termiiConfig,
    docReference: 'https://developers.termii.com/messaging',
    logoFileName: { light: 'termii.png', dark: 'termii.png' },
  },
  {
    id: 'sns',
    displayName: 'SNS',
    channel: ChannelTypeEnum.SMS,
    credentials: snsConfig,
    docReference: 'https://docs.aws.amazon.com/sns/index.html',
    logoFileName: { light: 'sns.svg', dark: 'sns.svg' },
  },
  {
    id: 'telnyx',
    displayName: 'Telnyx',
    channel: ChannelTypeEnum.SMS,
    credentials: telnyxConfig,
    docReference: 'https://developers.telnyx.com/',
    logoFileName: { light: 'telnyx.png', dark: 'telnyx.png' },
  },
  {
    id: 'twilio',
    displayName: 'Twilio',
    channel: ChannelTypeEnum.SMS,
    credentials: twilioConfig,
    docReference: 'https://www.twilio.com/docs',
    logoFileName: { light: 'twilio.png', dark: 'twilio.png' },
  },
  {
    id: 'gupshup',
    displayName: 'Gupshup',
    channel: ChannelTypeEnum.SMS,
    credentials: gupshupConfig,
    docReference: 'https://docs.gupshup.io/docs/send-single-message',
    logoFileName: { light: 'gupshup.png', dark: 'gupshup.png' },
  },
];
