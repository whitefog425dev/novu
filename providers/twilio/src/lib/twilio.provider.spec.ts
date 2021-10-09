import { TwilioSmsProvider } from './twilio.provider';

test('should trigger Twilio correctly', async () => {
  const provider = new TwilioSmsProvider({
    accountSid: 'AC<twilio-account-Sid>',
    authToken: '<twilio-auth-Token>',
    from: '+112345',
  });
  const spy = jest
    .spyOn(provider['twilioClient']['messages'], 'create')
    .mockImplementation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {} as any;
    });
  await provider.sendMessage({
    to: '+176543',
    content: 'SMS Content',
  });

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith({
    from: '+112345',
    body: 'SMS Content',
    to: '+176543',
  });
});
