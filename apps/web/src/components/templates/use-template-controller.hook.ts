import { useEffect } from 'react';
import {
  ChannelCTATypeEnum,
  ChannelTypeEnum,
  ICreateNotificationTemplateDto,
  INotificationTemplate,
  IUpdateNotificationTemplate,
  IEmailBlock,
} from '@novu/shared';
import { showNotification } from '@mantine/notifications';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Sentry from '@sentry/react';
import { createTemplate, updateTemplate } from '../../api/templates';
import { useTemplateFetcher } from './use-template.fetcher';
import { QueryKeys } from '../../api/query.keys';
import { useTemplateEditor } from './TemplateEditorProvider';

export function useTemplateController(templateId: string) {
  const {
    isDirty,
    setIsDirty,
    editMode,
    setEditMode,
    isEmbedModalVisible,
    setIsEmbedModalVisible,
    trigger,
    setTrigger,
    selectedMessageType,
    setSelectedMessageType,
    activeChannels,
    setActiveChannels,
  } = useTemplateEditor();

  useEffect(() => {
    setEditMode(!!templateId);
  }, []);

  const methods = useForm<IForm>({
    resolver: async (data) => {
      const errors: any = {};
      let values = data;
      if (!data.name) {
        errors.name = 'Required field name';
      }

      if (!data.notificationGroup) {
        errors.notificationGroup = 'Required field notification group';
      }

      if (activeChannels[ChannelTypeEnum.IN_APP]) {
        if (!data.inAppMessages[0]?.template.content) {
          errors['inAppMessages.0.template.content'] = 'Required field content';
        }
      }

      if (activeChannels[ChannelTypeEnum.EMAIL]) {
        for (const email of data.emailMessages) {
          if (!email?.template.subject) {
            errors[`emailMessages.${data.emailMessages.indexOf(email)}.template.subject`] = 'Required field subject';
          }
        }
      }

      if (activeChannels[ChannelTypeEnum.SMS]) {
        if (!data.smsMessages[0]?.template.content) {
          errors['smsMessages.0.template.content'] = 'Required field content';
        }
      }

      if (Object.keys(errors).length) {
        values = {} as any;
      }

      return {
        values,
        errors,
      };
    },
  });

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isDirty: isDirtyForm },
  } = methods;

  const {
    fields: emailMessagesFields,
    append: addEmailMessageField,
    remove: removeEmailField,
  } = useFieldArray({
    control,
    name: 'emailMessages',
  });

  const { fields: inAppFields, append: addInAppField } = useFieldArray({
    control,
    name: 'inAppMessages',
  });

  const { fields: smsFields, append: addSmsMessage } = useFieldArray({
    control,
    name: 'smsMessages',
  });

  const { fields: directFields, append: addDirectAppField } = useFieldArray({
    control,
    name: 'directMessages',
  });

  const navigate = useNavigate();
  const { template, refetch, loading: loadingEditTemplate } = useTemplateFetcher(templateId);
  const client = useQueryClient();

  const { isLoading, mutateAsync: createNotification } = useMutation<
    INotificationTemplate,
    { error: string; message: string; statusCode: number },
    ICreateNotificationTemplateDto
  >(createTemplate);

  const { isLoading: isUpdateLoading, mutateAsync: updateNotification } = useMutation<
    INotificationTemplate,
    { error: string; message: string; statusCode: number },
    { id: string; data: Partial<IUpdateNotificationTemplate> }
  >(({ id, data }) => updateTemplate(id, data));

  useEffect(() => {
    setValue('activeChannels', activeChannels);
  }, [activeChannels]);

  useEffect(() => {
    if (template && template.steps) {
      const inAppChannel = template.steps.filter((i) => i.template.type === ChannelTypeEnum.IN_APP);
      const emailChannel = template.steps.filter((i) => i.template.type === ChannelTypeEnum.EMAIL);
      const smsChannel = template.steps.filter((i) => i.template.type === ChannelTypeEnum.SMS);
      const directChannel = template.steps.filter((i) => i.template.type === ChannelTypeEnum.DIRECT);

      const formValues: IForm = {
        notificationGroup: template._notificationGroupId,
        name: template.name,
        description: template.description as string,
        tags: template.tags,
        inAppMessages: [],
        emailMessages: [],
        smsMessages: [],
        directMessages: [],
      };

      if (inAppChannel.length) {
        formValues.inAppMessages = inAppChannel;
        toggleChannel(ChannelTypeEnum.IN_APP, true);
      }

      if (emailChannel.length) {
        formValues.emailMessages = emailChannel;
        for (const item of formValues.emailMessages) {
          if (item.template.contentType === 'customHtml') {
            item.template.htmlContent = item.template.content as string;
            item.template.content = [];
          }
        }
        toggleChannel(ChannelTypeEnum.EMAIL, true);
      }

      if (smsChannel.length) {
        formValues.smsMessages = smsChannel;
        toggleChannel(ChannelTypeEnum.SMS, true);
      }

      if (directChannel.length) {
        formValues.directMessages = directChannel;
        toggleChannel(ChannelTypeEnum.DIRECT, true);
      }

      reset(formValues);
      setTrigger(template.triggers[0]);
    } else {
      reset(JSON.parse(JSON.stringify(defaultFormValues)));
    }
  }, [template]);

  useEffect(() => {
    if (selectedMessageType && !activeChannels[selectedMessageType]) {
      toggleChannel(selectedMessageType, true);
    }
  }, [selectedMessageType]);

  useEffect(() => {
    setEditMode(!!templateId);
  }, [templateId]);

  const onSubmit = async (data: IForm) => {
    const stepsData: any[] = [];

    if (activeChannels[ChannelTypeEnum.IN_APP]) {
      for (const item of data.inAppMessages) {
        stepsData.push({
          _id: item.template._id,
          type: ChannelTypeEnum.IN_APP,
          content: item.template.content as string,
          cta: {
            type: ChannelCTATypeEnum.REDIRECT,
            data: {
              url: item.template.cta?.data?.url,
            },
          },
        });
      }
    }

    if (activeChannels[ChannelTypeEnum.SMS]) {
      for (const item of data.smsMessages) {
        stepsData.push({
          _id: item.template._id,
          type: ChannelTypeEnum.SMS,
          content: item.template.content as string,
        });
      }
    }

    if (activeChannels[ChannelTypeEnum.EMAIL]) {
      for (const item of data.emailMessages) {
        stepsData.push({
          _id: item.template._id,
          name: item.template.name,
          subject: item.template.subject,
          type: ChannelTypeEnum.EMAIL,
          contentType: item.template.contentType,
          content: item.template.contentType === 'customHtml' ? item.template.htmlContent : item.template.content,
          filters: item.filters,
        });
      }
    }

    const payload: ICreateNotificationTemplateDto = {
      notificationGroupId: data.notificationGroup,
      name: data.name,
      description: data.description,
      tags: data.tags,
      steps: stepsData,
    };

    try {
      if (editMode) {
        await updateNotification({
          id: templateId,
          data: payload,
        });

        refetch();

        await client.refetchQueries(QueryKeys.changesCount);
        showNotification({
          message: 'Template updated successfully',
          color: 'green',
        });
        navigate('/templates');
      } else {
        const response = await createNotification({ ...payload, active: true, draft: false });

        setTrigger(response.triggers[0]);
        setIsEmbedModalVisible(true);

        await client.refetchQueries(QueryKeys.changesCount);
        showNotification({
          message: 'Template saved successfully',
          color: 'green',
        });
      }
    } catch (e: any) {
      Sentry.captureException(e);

      showNotification({
        message: e.message || 'Un-expected error occurred',
        color: 'red',
      });
    }
  };

  function toggleChannel(channel: ChannelTypeEnum, active: boolean) {
    const modifiedActiveChannel = {
      ...Object.assign(activeChannels, {
        [channel]: active,
      }),
    };

    setActiveChannels(modifiedActiveChannel);

    if (selectedMessageType === channel && !active) {
      let hasActive = false;

      for (const key in modifiedActiveChannel) {
        if (!modifiedActiveChannel.hasOwnProperty(key)) continue;

        if (modifiedActiveChannel[key]) {
          hasActive = true;
          changeSelectedMessage(key as ChannelTypeEnum);
          break;
        }
      }
      if (!hasActive) {
        changeSelectedMessage(null);
      }
    } else if (active && !selectedMessageType) {
      changeSelectedMessage(channel);
    }

    /**
     * When initialized a message without an email first, when editing caused an issue
     * NTF-156
     */
    if (selectedMessageType === ChannelTypeEnum.EMAIL && emailMessagesFields.length === 0) {
      addEmailMessageField({ ...defaultFormValues.emailMessages[0] });
    }

    if (selectedMessageType === ChannelTypeEnum.SMS && smsFields.length === 0) {
      addSmsMessage({ ...defaultFormValues.smsMessages[0] });
    }

    if (selectedMessageType === ChannelTypeEnum.IN_APP && inAppFields.length === 0) {
      addInAppField({ ...defaultFormValues.inAppMessages[0] });
    }

    if (selectedMessageType === ChannelTypeEnum.DIRECT && directFields.length === 0) {
      addDirectAppField({ ...defaultFormValues.directMessages[0] });
    }
  }

  const onTriggerModalDismiss = () => {
    navigate('/templates');
  };

  function changeSelectedMessage(messageType: ChannelTypeEnum | null) {
    setSelectedMessageType(messageType);
  }

  function addMessage(channelType: ChannelTypeEnum) {
    addEmailMessageField({
      template: {
        type: channelType,
        content: [],
        contentType: 'editor',
        subject: '',
        name: 'Email Message Template',
      },
    });
  }

  function removeEmailMessage(index: number) {
    removeEmailField(index);
  }

  return {
    addMessage,
    editMode,
    template,
    selectedMessageType,
    changeSelectedMessage,
    onSubmit,
    isEmbedModalVisible,
    trigger,
    isLoading,
    isUpdateLoading,
    loadingEditTemplate,
    activeChannels,
    toggleChannel,
    onTriggerModalDismiss,
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    methods,
    removeEmailMessage,
    errors,
    smsFields,
    emailMessagesFields,
    inAppFields,
    directFields,
    setIsDirty,
    isDirty: isDirtyForm || isDirty,
  };
}

export interface ITemplateMessage {
  template: {
    content: string | IEmailBlock[];
    htmlContent?: string;
    _id?: string;
    subject?: string;
    cta?: any;
    name?: string;
    type: ChannelTypeEnum;
    contentType?: 'editor' | 'customHtml';
  };
  filters?: any[];
}

export interface IForm {
  activeChannels?: { [key: string]: boolean };
  notificationGroup: string;
  name: string;
  description: string;
  tags: string[];
  emailMessages: ITemplateMessage[];
  inAppMessages: ITemplateMessage[];
  smsMessages: ITemplateMessage[];
  directMessages: ITemplateMessage[];
}

const defaultFormValues = {
  inAppMessages: [
    {
      template: {
        _id: undefined,
        type: ChannelTypeEnum.IN_APP,
        content: '',
      },
      filters: [],
    },
  ] as ITemplateMessage[],
  emailMessages: [
    {
      template: {
        _id: undefined,
        type: ChannelTypeEnum.EMAIL,
        contentType: 'editor',
        content: [],
        subject: '',
        name: 'Email Message Template',
      },
      filters: [],
    },
  ] as ITemplateMessage[],
  smsMessages: [
    {
      template: {
        _id: undefined,
        contentType: undefined,
        type: ChannelTypeEnum.SMS,
        content: '',
      },
      filters: [],
    },
  ] as ITemplateMessage[],
  directMessages: [
    {
      template: {
        _id: undefined,
        contentType: undefined,
        type: ChannelTypeEnum.DIRECT,
        content: '',
      },
      filters: [],
    },
  ] as ITemplateMessage[],
};
