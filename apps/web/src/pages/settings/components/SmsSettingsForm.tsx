import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { IApplication } from '@notifire/shared';
import { message } from 'antd';
import { updateSmsSettings } from '../../../api/application';
import { Input, Button } from '../../../design-system';
import Card from '../../../components/layout/components/Card';

export function SmsSettingsForm({ application, refetch }: { application: IApplication | undefined; refetch: any }) {
  const { isLoading: isLoadingSmsSettings, mutateAsync: updateSmsSettingsMutation } = useMutation<
    { senderEmail: string },
    { error: string; message: string; statusCode: number },
    { authToken: string; accountSid: string; phoneNumber: string }
  >(updateSmsSettings);

  async function onSmsSettingsSubmit({ authToken, accountSid, phoneNumber }) {
    await updateSmsSettingsMutation({
      authToken,
      accountSid,
      phoneNumber,
    });
    refetch();

    message.success('Successfully updated sms settings');
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      authToken: application?.channels?.sms?.twillio?.authToken || '',
      accountSid: application?.channels?.sms?.twillio?.accountSid || '',
      phoneNumber: application?.channels?.sms?.twillio?.phoneNumber || '',
    },
  });

  return (
    <Card title="Twillio Integration Details">
      <form onSubmit={handleSubmit(onSmsSettingsSubmit)}>
        <Input
          label="Account SID"
          required
          data-test-id="account-sid"
          error={errors.accountSid?.message}
          {...register('accountSid', { required: 'Please input a valid account sid' })}
        />
        <Input
          mt={25}
          required
          error={errors.authToken?.message}
          label="Auth Token"
          data-test-id="auth-token"
          {...register('authToken', { required: 'Please enter auth token' })}
        />
        <Input
          mt={25}
          required
          error={errors.phoneNumber?.message}
          label="Phone Number"
          data-test-id="phone-number"
          {...register('phoneNumber', { required: 'Please enter a phone number' })}
        />
        <Button mt={25} submit data-test-id="submit-update-settings" loading={isLoadingSmsSettings}>
          Update
        </Button>
      </form>
    </Card>
  );
}
