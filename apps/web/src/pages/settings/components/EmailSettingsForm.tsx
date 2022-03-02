import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { IApplication } from '@notifire/shared';
import { message } from 'antd';
import { Input, Button } from '../../../design-system';
import { updateEmailSettings } from '../../../api/application';
import Card from '../../../components/layout/components/Card';

export function EmailSettingsForm({ application, refetch }: { application: IApplication | undefined; refetch: any }) {
  const { isLoading: isLoadingEmailSettings, mutateAsync: changeEmailSettings } = useMutation<
    { senderEmail: string },
    { error: string; message: string; statusCode: number },
    { senderEmail: string; senderName: string }
  >(updateEmailSettings);

  async function onEmailSettingsSubmit({ senderEmail, senderName }) {
    await changeEmailSettings({
      senderEmail,
      senderName,
    });
    refetch();

    message.success('Successfully updated email settings');
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: false,
    defaultValues: {
      senderEmail: application?.channels?.email?.senderEmail || '',
      senderName: application?.channels?.email?.senderName || '',
    },
  });

  return (
    <Card title="Sender Identity">
      <form onSubmit={handleSubmit(onEmailSettingsSubmit)}>
        <Input
          label="Sender Email"
          required
          error={errors.senderEmail?.message}
          {...register('senderEmail', {
            required: 'Please provide a valid email',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please provide a valid email' },
          })}
          data-test-id="sender-email"
        />
        <Input
          label="Sender Name"
          mt={25}
          required
          error={errors.senderName?.message}
          {...register('senderName', { required: 'Please enter a sender name' })}
          data-test-id="sender-name"
        />

        <Button mt={25} loading={isLoadingEmailSettings} submit data-test-id="submit-update-settings">
          Update
        </Button>
      </form>
    </Card>
  );
}
