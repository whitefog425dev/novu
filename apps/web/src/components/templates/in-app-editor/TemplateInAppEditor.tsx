import { Control, Controller } from 'react-hook-form';
import { Container, Group } from '@mantine/core';
import { IForm } from '../use-template-controller.hook';
import { InAppEditorBlock } from './InAppEditorBlock';
import { Input } from '../../../design-system';
import { useEnvController } from '../../../store/use-env-controller';

export function TemplateInAppEditor({ control, index }: { control: Control<IForm>; index: number; errors: any }) {
  const { readonly } = useEnvController();

  return (
    <>
      <Container sx={{ maxWidth: '400px', paddingLeft: '0px', margin: '0 auto 15px auto' }}>
        <Group grow direction="column">
          <Controller
            name={`inAppMessages.${index}.template.cta.data.url` as any}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                disabled={readonly}
                description="The URL that will be opened when the user clicks the CTA button."
                data-test-id="inAppRedirect"
                label="Redirect URL"
                placeholder="i.e /tasks/{{taskId}}"
              />
            )}
          />
          <Controller
            name={`inAppMessages.${index}.template.content` as any}
            data-test-id="in-app-content-form-item"
            control={control}
            render={({ field }) => {
              const { ref, ...fieldRefs } = field;

              return (
                <InAppEditorBlock
                  {...fieldRefs}
                  readonly={readonly}
                  contentPlaceholder="Write your notification content here..."
                />
              );
            }}
          />
        </Group>
      </Container>
    </>
  );
}
