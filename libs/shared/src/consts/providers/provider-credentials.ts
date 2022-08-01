import { CredentialsKeyEnum } from './provider.enum';
import { IConfigCredentials } from './provider.interface';

const mailConfigBase: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.From,
    displayName: 'From email address',
    description: 'Use the authenticated email address from the delivery provider you will send emails from.',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SenderName,
    displayName: 'Sender name',
    type: 'string',
    required: true,
  },
];

const smsConfigBase: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.From,
    displayName: 'From',
    type: 'string',
    required: true,
  },
];

const pushConfigBase: IConfigCredentials[] = [];

export const mailJsConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'Secret key',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const mailgunConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.User,
    displayName: 'User name',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Domain,
    displayName: 'Domain',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const mailjetConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'API Secret',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const nexmoConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'API secret',
    type: 'string',
    required: true,
  },
  ...smsConfigBase,
];

export const mandrillConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const nodemailerConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.User,
    displayName: 'User',
    type: 'string',
    required: false,
  },
  {
    key: CredentialsKeyEnum.Password,
    displayName: 'Password',
    type: 'string',
    required: false,
  },
  {
    key: CredentialsKeyEnum.Host,
    displayName: 'Host',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Port,
    displayName: 'Port',
    type: 'number',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Secure,
    displayName: 'Secure',
    type: 'boolean',
    required: false,
  },
  {
    key: CredentialsKeyEnum.Domain,
    displayName: 'DKIM: Domain name',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'DKIM: Private key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.AccountSid,
    displayName: 'DKIM: Key selector',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const postmarkConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const sendgridConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const sendinblueConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const sesConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'Access key ID',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'Secret access key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Region,
    displayName: 'Region',
    type: 'string',
    required: true,
  },
  ...mailConfigBase,
];

export const plivoConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.AccountSid,
    displayName: 'Account SID',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Token,
    displayName: 'Auth token',
    type: 'string',
    required: true,
  },
  ...smsConfigBase,
];

export const sms77Config: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  ...smsConfigBase,
];

export const termiiConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  ...smsConfigBase,
];

export const snsConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'Access key ID',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'Secret access key',
    type: 'string',
    required: true,
  },
];

export const telnyxConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.MessageProfileId,
    displayName: 'Message profile ID',
    type: 'string',
    required: true,
  },
  ...smsConfigBase,
];

export const twilioConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.AccountSid,
    displayName: 'Account SID',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Token,
    displayName: 'Auth token',
    type: 'string',
    required: true,
  },
  ...smsConfigBase,
];

export const fcmConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ProjectName,
    displayName: 'Service Account Project Name',
    type: 'string',
    required: false,
  },
  {
    key: CredentialsKeyEnum.User,
    displayName: 'Service Account Client Email',
    type: 'string',
    required: false,
  },
  {
    key: CredentialsKeyEnum.SecretKey,
    displayName: 'Service Account Private Key',
    type: 'string',
    required: false,
  },
  ...pushConfigBase,
];

export const gupshupConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.User,
    displayName: 'User id',
    type: 'string',
    required: true,
  },
  {
    key: CredentialsKeyEnum.Password,
    displayName: 'Password',
    type: 'string',
    required: true,
  },
];
