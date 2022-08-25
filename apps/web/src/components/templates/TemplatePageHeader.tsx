import { Container, Grid, Group } from '@mantine/core';
import { useState } from 'react';
import { Button, Switch, Title } from '../../design-system';
import { ActivePageEnum } from '../../pages/templates/editor/TemplateEditorPage';
import { useEnvController } from '../../store/use-env-controller';
import { EditorPreviewSwitch } from './EditorPreviewSwitch';
import { useStatusChangeControllerHook } from './use-status-change-controller.hook';
import { useTemplateController } from './use-template-controller.hook';

const Header = ({ activePage, editMode }: { editMode: boolean; activePage: ActivePageEnum }) => {
  if (activePage === ActivePageEnum.SETTINGS) {
    return <>{editMode ? 'Edit Template' : 'Create new template'}</>;
  }
  if (activePage === ActivePageEnum.WORKFLOW) {
    return <>{'Workflow Editor'}</>;
  }

  if (activePage === ActivePageEnum.USER_PREFERENCE) {
    return <>{'User Preference Editor'}</>;
  }

  if (activePage === ActivePageEnum.SMS) {
    return <>{'Edit SMS Template'}</>;
  }

  if (activePage === ActivePageEnum.EMAIL) {
    return <>{'Edit Email Template'}</>;
  }

  if (activePage === ActivePageEnum.PUSH) {
    return <>{'Edit Push Template'}</>;
  }

  if (activePage === ActivePageEnum.CHAT) {
    return <>{'Edit Chat Template'}</>;
  }

  if (activePage === ActivePageEnum.IN_APP) {
    return <>{'Edit Notification Template'}</>;
  }

  return <>{editMode ? 'Edit Template' : 'Create new template'}</>;
};

interface Props {
  templateId: string;
  loading: boolean;
  disableSubmit: boolean;
  setActivePage: (activePage: ActivePageEnum) => void;
  activePage: ActivePageEnum;
}

export const TemplatePageHeader = ({ templateId, loading, disableSubmit, activePage }: Props) => {
  const { editMode, template } = useTemplateController(templateId);
  const [view, setView] = useState<'Edit' | 'Preview'>('Edit');
  const { readonly } = useEnvController();

  const { isTemplateActive, changeActiveStatus, isStatusChangeLoading } = useStatusChangeControllerHook(
    templateId,
    template
  );

  return (
    <Container fluid sx={{ padding: '20px' }}>
      <Group position="apart">
        <div>
          <Title>
            <Header editMode={editMode} activePage={activePage} />
          </Title>
        </div>
        <div>
          <EditorPreviewSwitch view={view} setView={setView} />
        </div>
        <div>
          <Grid align="center" gutter={50}>
            {editMode && (
              <Grid.Col span={6}>
                <Switch
                  label={isTemplateActive ? 'Enabled' : 'Disabled'}
                  loading={isStatusChangeLoading}
                  disabled={readonly}
                  data-test-id="active-toggle-switch"
                  onChange={(e) => changeActiveStatus(e.target.checked)}
                  checked={isTemplateActive || false}
                />
              </Grid.Col>
            )}
            <Grid.Col span={6}>
              <Button mr={20} data-test-id="submit-btn" loading={loading} disabled={disableSubmit} submit>
                {editMode ? 'Update' : 'Create'}
              </Button>
            </Grid.Col>
          </Grid>
        </div>
      </Group>
    </Container>
  );
};
