const sendMailMock = jest.fn().mockReturnValue(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {} as any;
});

// eslint-disable-next-line import/first
import { NodemailerProvider } from './nodemailer.provider';

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: sendMailMock,
    }),
  };
});

test('should trigger nodemailer correctly', async () => {
  const provider = new NodemailerProvider({
    from: 'test@test.com',
    host: 'test.test.email',
    user: 'test@test.com',
    password: 'test123',
    port: 587,
    secure: false,
  });

  await provider.sendMessage({
    to: 'test@test2.com',
    subject: 'test subject',
    html: '<div> Mail Content </div>',
    attachments: [
      { mime: 'text/plain', file: Buffer.from('test'), name: 'test.txt' },
    ],
  });

  expect(sendMailMock).toHaveBeenCalled();
  expect(sendMailMock).toHaveBeenCalledWith({
    from: 'test@test.com',
    html: '<div> Mail Content </div>',
    subject: 'test subject',
    to: 'test@test2.com',
    attachments: [
      {
        contentType: 'text/plain',
        content: 'test',
        filename: 'test.txt',
      },
    ],
  });
});
