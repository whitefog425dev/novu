import { ChannelTypeEnum } from '@novu/shared';
import { useState } from 'react';
import { useActiveIntegrations } from '../../api/hooks';
import { EmailMessagesCards } from './email-editor/EmailMessagesCards';
import { TemplateInAppEditor } from './in-app-editor/TemplateInAppEditor';
import { TemplateSMSEditor } from './TemplateSMSEditor';
import { useTemplateController } from './use-template-controller.hook';
import { ActivePageEnum } from '../../pages/templates/editor/TemplateEditorPage';
import { TemplateDirectEditor } from './direct-editor/TemplateDirectEditor';

export const TemplateEditor = ({ activePage, disableSave, loading, templateId }) => {
  const [view, setView] = useState<'Edit' | 'Preview'>('Edit');
  const { integrations } = useActiveIntegrations();

  const {
    changeSelectedMessage,
    trigger,
    control,
    smsFields,
    emailMessagesFields,
    inAppFields,
    directFields,
    errors,
    removeEmailMessage,
  } = useTemplateController(templateId);

  return (
    <div>
      {activePage === ActivePageEnum.SMS && (
        <div style={{ padding: '20px 25px' }}>
          {smsFields.map((message, index) => {
            return (
              <TemplateSMSEditor
                key={index}
                control={control}
                index={index}
                errors={errors}
                isIntegrationActive={!!integrations?.some((integration) => integration.channel === ChannelTypeEnum.SMS)}
              />
            );
          })}
        </div>
      )}
      {activePage === ActivePageEnum.EMAIL && (
        <>
          <EmailMessagesCards
            variables={trigger?.variables || []}
            onRemoveTab={removeEmailMessage}
            emailMessagesFields={emailMessagesFields}
            isIntegrationActive={!!integrations?.some((integration) => integration.channel === ChannelTypeEnum.EMAIL)}
          />
        </>
      )}
      {activePage === ActivePageEnum.IN_APP && (
        <>
          {inAppFields.map((message, index) => {
            return <TemplateInAppEditor key={index} errors={errors} control={control} index={index} />;
          })}
        </>
      )}
      {activePage === ActivePageEnum.DIRECT && (
        <>
          {directFields.map((message, index) => {
            return (
              <TemplateDirectEditor
                key={index}
                errors={errors}
                control={control}
                index={index}
                isIntegrationActive={
                  !!integrations?.some((integration) => integration.channel === ChannelTypeEnum.DIRECT)
                }
              />
            );
          })}
        </>
      )}
    </div>
  );
};
