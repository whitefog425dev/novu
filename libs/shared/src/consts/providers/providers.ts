import {
  IProviderConfig,
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
} from './provider.interface';
import { ChannelTypeEnum } from '../../entities/message-template';

export const providers: IProviderConfig[] = [
  {
    id: 'emailjs',
    displayName: 'Email.js',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mailJsConfig,
    docReference: 'https://www.emailjs.com/docs/',
  },
  {
    id: 'mailgun',
    displayName: 'Mailgun',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mailgunConfig,
    docReference: 'https://documentation.mailgun.com/en/latest/',
  },
  {
    id: 'mailjet',
    displayName: 'Mailjet',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mailjetConfig,
    docReference:
      'https://documentation.mailjet.com/hc/en-us/categories/360003942934-Mailjet-Documentation-Center-?utm_term=&utm_campaign=2090162100&utm_content=&utm_source=google&utm_medium=cpc&creative=376403038923&keyword=&matchtype=&network=g&device=c&gclid=CjwKCAjwlcaRBhBYEiwAK341jZcp57kFjJav0TcX06RVp0Z0Ws4cMVCghQ52SIL8Fb3aJ9Fpcnu9axoCXDgQAvD_BwE',
  },
  {
    id: 'mandrill',
    displayName: 'Mandrill',
    channel: ChannelTypeEnum.EMAIL,
    credentials: mandrillConfig,
    docReference: 'https://mandrillapp.com/docs/?_ga=1.34114145.1141874178.1422518109',
  },
  {
    id: 'nexmo',
    displayName: 'Nexmo',
    channel: ChannelTypeEnum.SMS,
    credentials: nexmoConfig,
    docReference: 'https://developer.nexmo.com/api/sms?theme=dark',
  },
  {
    id: 'nodemailer',
    displayName: 'Nodemailer',
    channel: ChannelTypeEnum.EMAIL,
    credentials: nodemailerConfig,
    docReference: 'https://nodemailer.com/about/',
  },
  {
    id: 'plivo',
    displayName: 'Plivo',
    channel: ChannelTypeEnum.SMS,
    credentials: plivoConfig,
    docReference: 'https://www.plivo.com/docs/',
  },
  {
    id: 'postmark',
    displayName: 'Postmark',
    channel: ChannelTypeEnum.EMAIL,
    credentials: postmarkConfig,
    docReference: 'https://postmarkapp.com/developer',
  },
  {
    id: 'sendgrid',
    displayName: 'SendGrid',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sendgridConfig,
    docReference: 'https://docs.sendgrid.com/',
  },
  {
    id: 'sendinblue',
    displayName: 'Sendinblue',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sendinblueConfig,
    docReference:
      'https://www.sendinblue.com/?utm_source=adwords_brand&utm_medium=lastclick&utm_content=SendinBlue&utm_extension&utm_term=%2Bsendinblue&utm_matchtype=b&utm_campaign=629579262&utm_network=g&km_adid=355470526977&km_adposition&km_device=c&utm_adgroupid=31406137162&gclid=CjwKCAjwlcaRBhBYEiwAK341jUKWuciIZYX0QDYm9Y8bga6i1-bAC1D36eUPvBWJRawD347sUXlxXxoC3B4QAvD_BwE',
  },
  {
    id: 'ses',
    displayName: 'SES',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sesConfig,
    docReference: 'https://docs.aws.amazon.com/ses/index.html',
  },
  {
    id: 'sms77',
    displayName: 'sms77',
    channel: ChannelTypeEnum.SMS,
    credentials: sms77Config,
    docReference: 'https://www.sms77.io/de/docs/gateway/http-api/',
  },
  {
    id: 'sns',
    displayName: 'SNS',
    channel: ChannelTypeEnum.SMS,
    credentials: snsConfig,
    docReference: 'https://docs.aws.amazon.com/sns/index.html',
  },
  {
    id: 'telnyx',
    displayName: 'Telnyx',
    channel: ChannelTypeEnum.SMS,
    credentials: telnyxConfig,
    docReference: 'https://developers.telnyx.com/',
  },
  {
    id: 'twilio',
    displayName: 'Twilio',
    channel: ChannelTypeEnum.SMS,
    credentials: twilioConfig,
    docReference: 'https://www.twilio.com/docs',
  },
];
