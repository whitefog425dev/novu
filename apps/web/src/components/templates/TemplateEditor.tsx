import { ChannelTypeEnum } from '@novu/shared';
import { useActiveIntegrations } from '../../api/hooks';
import { EmailMessagesCards } from './email-editor/EmailMessagesCards';
import { TemplateInAppEditor } from './in-app-editor/TemplateInAppEditor';
import { TemplateSMSEditor } from './TemplateSMSEditor';
import { useTemplateController } from './use-template-controller.hook';
import { ActivePageEnum } from '../../pages/templates/editor/TemplateEditorPage';

export const TemplateEditor = ({ activePage, templateId, activeStep }) => {
  const { integrations } = useActiveIntegrations();

  const { trigger, control, errors, stepFields } = useTemplateController(templateId);

  return (
    <div>
      {activePage === ActivePageEnum.SMS && (
        <div style={{ padding: '20px 25px' }}>
          {stepFields.map((message, index) => {
            return message.template.type === ChannelTypeEnum.SMS &&
              (activeStep === message._id || activeStep === message.id) ? (
              <TemplateSMSEditor
                key={message._id}
                control={control}
                index={index}
                errors={errors}
                isIntegrationActive={!!integrations?.some((integration) => integration.channel === ChannelTypeEnum.SMS)}
              />
            ) : null;
          })}
        </div>
      )}
      {activePage === ActivePageEnum.EMAIL && (
        <div style={{ padding: '20px 25px' }}>
          {stepFields.map((message, index) => {
            return message.template.type === ChannelTypeEnum.EMAIL &&
              (activeStep === message._id || activeStep === message.id) ? (
              <EmailMessagesCards
                key={message._id}
                variables={trigger?.variables || []}
                index={index}
                isIntegrationActive={
                  !!integrations?.some((integration) => integration.channel === ChannelTypeEnum.EMAIL)
                }
              />
            ) : null;
          })}
        </div>
      )}
      {activePage === ActivePageEnum.IN_APP && (
        <>
          {stepFields.map((message, index) => {
            return message.template.type === ChannelTypeEnum.IN_APP &&
              (activeStep === message._id || activeStep === message.id) ? (
              <TemplateInAppEditor key={message._id} errors={errors} control={control} index={index} />
            ) : null;
          })}
        </>
      )}
    </div>
  );
};
