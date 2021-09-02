import { Notifire } from './notifire';
import { ChannelTypeEnum } from './template/template.interface';

test('should register an SMS provider and return it', async () => {
  const notifire = new Notifire();

  const template = {
    id: 'test',
    channelType: ChannelTypeEnum.SMS,
    sendMessage: () => null,
  };

  await notifire.registerProvider(template);
  const provider = await notifire.getProviderById('test');

  expect(provider).toBeTruthy();
  expect(provider.id).toEqual('test');
});

test('should call 2 hooks', async () => {
  const notifire = new Notifire();

  const template = {
    id: 'test',
    channelType: ChannelTypeEnum.SMS,
    sendMessage: () => null,
  };

  await notifire.registerProvider(template);
  await notifire.registerTemplate({
    id: 'test-template',
    messages: [
      {
        channel: ChannelTypeEnum.SMS,
        template: 'test {{$user_id}}',
      },
    ],
  });

  const spyOn = jest.spyOn(notifire, 'emit');

  await notifire.trigger('test-template', {
    $user_id: 'test-user',
    $email: 'test-user@sd.com',
  });

  expect(spyOn).toHaveBeenCalledTimes(2);
});
