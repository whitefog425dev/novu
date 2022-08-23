import { useMantineTheme } from '@mantine/core';
import { DeepRequired, FieldErrorsImpl, useFormState } from 'react-hook-form';
import styled from '@emotion/styled';
import { colors, TemplateButton, Text } from '../../design-system';
import { BellGradient, ConnectGradient, LevelsGradient, TapeGradient } from '../../design-system/icons';
import { ActivePageEnum } from '../../pages/templates/editor/TemplateEditorPage';
import { When } from '../utils/When';

export function TemplatesSideBar({
  activeTab,
  changeTab,
  showTriggerSection = false,
  showErrors,
  minimalView = false,
}: {
  activeTab: string;
  changeTab: (string) => void;
  showTriggerSection: boolean;
  showErrors: boolean;
  minimalView?: boolean;
}) {
  const { errors } = useFormState<{
    name: string;
    notificationGroup: string;
  }>();

  const theme = useMantineTheme();
  const textColor = theme.colorScheme === 'dark' ? colors.B40 : colors.B70;

  return (
    <>
      <TemplateButton
        tabKey={ActivePageEnum.SETTINGS}
        changeTab={changeTab}
        Icon={BellGradient}
        testId="settingsButton"
        active={activeTab === ActivePageEnum.SETTINGS}
        description={minimalView ? '' : `Configure cross-channel notification settings`}
        label={minimalView ? '' : `Notification Settings`}
        errors={showErrors && (errors.name?.message || errors.notificationGroup?.message)}
      />

      <TemplateButton
        tabKey={ActivePageEnum.WORKFLOW}
        changeTab={changeTab}
        Icon={ConnectGradient}
        testId="workflowButton"
        active={activeTab === ActivePageEnum.WORKFLOW}
        description={minimalView ? '' : `Create multi-step workflows`}
        label={minimalView ? '' : `Workflow Editor`}
        errors={showErrors && getStepsErrors(errors)}
      />

      <TemplateButton
        tabKey={ActivePageEnum.USER_PREFERENCE}
        changeTab={changeTab}
        Icon={LevelsGradient}
        testId="userPreferenceButton"
        active={activeTab === ActivePageEnum.USER_PREFERENCE}
        label={minimalView ? '' : `User Preference Editor`}
        description={minimalView ? '' : `Update user preference`}
        errors={showErrors && getStepsErrors(errors)}
      />

      {showTriggerSection && (
        <NavSection>
          <When truthy={!minimalView}>
            <Text mt={10} mb={20} color={textColor}>
              Implementation Code
            </Text>
          </When>
          <TemplateButton
            tabKey={ActivePageEnum.TRIGGER_SNIPPET}
            changeTab={changeTab}
            Icon={TapeGradient}
            testId="triggerCodeSelector"
            active={activeTab === ActivePageEnum.TRIGGER_SNIPPET}
            description={minimalView ? '' : `Get your notification trigger code snippet`}
            label={minimalView ? '' : `Trigger Snippet`}
          />
        </NavSection>
      )}
    </>
  );
}

function getStepsErrors(errors: FieldErrorsImpl<DeepRequired<{ name: string; notificationGroup: string }>>) {
  const keys = Object.keys(errors);
  const channelErrors = keys.filter((key) => {
    return key.includes(`steps`);
  });

  return channelErrors.length > 0 && 'Something is missing here';
}

const NavSection = styled.div``;
