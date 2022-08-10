import { Controller, useFormContext } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useEffect } from 'react';
import { ActionIcon, Grid, InputWrapper } from '@mantine/core';
import { getNotificationGroups } from '../../api/notifications';
import { api } from '../../api/api.client';
import { Checkbox, Input, Select, Tooltip } from '../../design-system';
import { useEnvController } from '../../store/use-env-controller';
import { INotificationTrigger } from '@novu/shared';
import { useClipboard } from '@mantine/hooks';
import { Check, Copy } from '../../design-system/icons';
import { inputStyles } from '../../design-system/config/inputs.styles';

export const NotificationSettingsForm = ({
  editMode,
  trigger,
}: {
  editMode: boolean;
  trigger?: INotificationTrigger;
}) => {
  const idClipboard = useClipboard({ timeout: 1000 });
  const queryClient = useQueryClient();
  const { readonly } = useEnvController();
  const {
    formState: { errors },
    setValue,
    control,
    getValues,
  } = useFormContext();

  const { data: groups, isLoading: loadingGroups } = useQuery('notificationGroups', getNotificationGroups);
  const { isLoading: loadingCreateGroup, mutateAsync: createNotificationGroup } = useMutation<
    { name: string; _id: string },
    { error: string; message: string; statusCode: number },
    {
      name: string;
    }
  >((data) => api.post(`/v1/notification-groups`, data), {
    onSuccess: (data) => {
      queryClient.setQueryData('notificationGroups', [...groups, data]);
    },
  });

  useEffect(() => {
    const group = getValues('notificationGroup');
    if (groups?.length && !editMode && !group) {
      selectFirstGroupByDefault();
    }
  }, [groups, editMode]);

  function selectFirstGroupByDefault() {
    setTimeout(() => {
      setValue('notificationGroup', groups[0]._id);
    }, 0);
  }

  async function addGroupItem(newGroup) {
    if (newGroup) {
      const response = await createNotificationGroup({
        name: newGroup,
      });

      setTimeout(() => {
        setValue('notificationGroup', response._id);
      }, 0);
    }
  }

  return (
    <Grid gutter={30} grow>
      <Grid.Col md={6} sm={12}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              mb={30}
              data-test-id="title"
              disabled={readonly}
              required
              value={field.value || ''}
              error={errors.name?.message}
              label="Notification Name"
              description="This will be used to identify the notification in the dashboard."
              placeholder="Notification name goes here..."
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ''}
              disabled={readonly}
              mb={30}
              data-test-id="description"
              description="Write an internal description of when and how this notification will be used."
              label="Notification Description"
              placeholder="Describe your notification..."
            />
          )}
        />
        <Controller
          name="preferenceSettings"
          control={control}
          render={({ field }) => {
            const preferences = field.value;

            const mock = { channel: true };

            const data = preferences ? preferences : mock;

            function handleCheckboxChange(e, channelType) {
              const newData = Object.assign({}, preferences);
              newData[channelType] = e.currentTarget.checked;
              field.onChange(newData);
            }

            return (
              <InputWrapper label="Template default" description="Description here" styles={inputStyles}>
                <Grid>
                  {Object.keys(data).map((key) => {
                    return (
                      <Grid.Col span={3}>
                        <Checkbox
                          checked={data[key] || false}
                          disabled={readonly}
                          data-test-id={`preference-${key}`}
                          label={key}
                          onChange={(e) => handleCheckboxChange(e, key)}
                        />
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </InputWrapper>
            );
          }}
        />
      </Grid.Col>
      <Grid.Col md={6} sm={12}>
        {trigger && (
          <Input
            mb={30}
            data-test-id="trigger-id"
            disabled={true}
            value={trigger.identifier || ''}
            error={errors.name?.message}
            label="Notification Identifier"
            description="This will be used to identify the notification template using the API."
            rightSection={
              <Tooltip data-test-id={'Tooltip'} label={idClipboard.copied ? 'Copied!' : 'Copy Key'}>
                <ActionIcon variant="transparent" onClick={() => idClipboard.copy(trigger.identifier)}>
                  {idClipboard.copied ? <Check /> : <Copy />}
                </ActionIcon>
              </Tooltip>
            }
          />
        )}
        <Controller
          name="notificationGroup"
          control={control}
          render={({ field }) => {
            return (
              <>
                <Select
                  {...field}
                  label="Notification Group"
                  data-test-id="groupSelector"
                  loading={loadingGroups || loadingCreateGroup}
                  disabled={readonly}
                  creatable
                  searchable
                  required
                  description="Categorize notifications into groups for unified settings control"
                  error={errors.notificationGroup?.message}
                  getCreateLabel={(newGroup) => <div data-test-id="submit-category-btn">+ Create Group {newGroup}</div>}
                  onCreate={addGroupItem}
                  placeholder="Attach notification to group"
                  data={(groups || []).map((item) => ({ label: item.name, value: item._id }))}
                />
              </>
            );
          }}
        />
        <Controller
          name="critical"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value || false}
              disabled={readonly}
              data-test-id="critical"
              label="Critical Workflow"
            />
          )}
        />
      </Grid.Col>
    </Grid>
  );
};
