import FlowEditor from '../../../components/workflow/FlowEditor';
import styled from '@emotion/styled';
import { Button, colors, DragButton, Text, Title } from '../../../design-system';
import { ActionIcon, Divider, Grid, Stack, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ChannelTypeEnum } from '@novu/shared';
import { Close } from '../../../design-system/icons/actions/Close';
import { channels, getChannel } from '../shared/channels';
import { useTemplateController } from '../../../components/templates/use-template-controller.hook';
import { StepActiveSwitch } from './StepActiveSwitch';
import { useEnvController } from '../../../store/use-env-controller';
import { When } from '../../../components/utils/When';

const capitalize = (text: string) => {
  return typeof text !== 'string' ? '' : text.charAt(0).toUpperCase() + text.slice(1);
};

const WorkflowEditorPage = ({
  setActivePage,
  templateId,
  setActiveStep,
  activeStep,
}: {
  setActivePage: (string) => void;
  setActiveStep: any;
  templateId: string;
  activeStep: number;
}) => {
  const { colorScheme } = useMantineColorScheme();
  const [selectedChannel, setSelectedChannel] = useState<ChannelTypeEnum | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [dragging, setDragging] = useState(false);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const { addStep, control, watch, errors } = useTemplateController(templateId);
  const steps = watch('steps');
  const { readonly } = useEnvController();

  useEffect(() => {
    if (selectedNodeId.length === 0) {
      setSelectedChannel(null);

      return;
    }
    const step = steps.find((item) => item._id === selectedNodeId || item.id === selectedNodeId);
    const index = steps.findIndex((item) => item._id === selectedNodeId || item.id === selectedNodeId);
    if (!step) {
      return;
    }
    setSelectedChannel(step.template.type);
    setActiveStep(index);
  }, [selectedNodeId]);

  return (
    <div style={{ minHeight: 500 }}>
      <Grid gutter={0} grow style={{ minHeight: 500 }}>
        <Grid.Col md={9} sm={6}>
          <FlowEditor
            setActivePage={setActivePage}
            dragging={dragging}
            templateId={templateId}
            errors={errors}
            steps={steps}
            addStep={addStep}
            setSelectedNodeId={setSelectedNodeId}
          />
        </Grid.Col>
        <Grid.Col md={3} sm={6}>
          <SideBarWrapper dark={colorScheme === 'dark'}>
            {selectedChannel ? (
              <StyledNav data-test-id="step-properties-side-menu">
                <NavSection>
                  <ButtonWrapper>
                    <Title size={2}>{getChannel(selectedChannel)?.label} Properties</Title>
                    <ActionIcon
                      data-test-id="close-side-menu-btn"
                      variant="transparent"
                      onClick={() => setSelectedChannel(null)}
                    >
                      <Close />
                    </ActionIcon>
                  </ButtonWrapper>
                </NavSection>
                <NavSection>
                  <EditTemplateButton
                    mt={10}
                    variant="outline"
                    data-test-id="edit-template-channel"
                    fullWidth
                    onClick={() =>
                      setActivePage(
                        selectedChannel === ChannelTypeEnum.IN_APP ? selectedChannel : capitalize(selectedChannel)
                      )
                    }
                  >
                    Edit Template
                  </EditTemplateButton>
                  <Divider my={30} />
                  {steps.map((i, index) => {
                    return index === activeStep ? (
                      <StepActiveSwitch key={index} index={activeStep} control={control} templateId={templateId} />
                    ) : null;
                  })}
                </NavSection>
              </StyledNav>
            ) : (
              <StyledNav data-test-id="drag-side-menu">
                <NavSection>
                  <Title size={2}>Steps to add</Title>
                  <Text color={colors.B60} mt={10}>
                    <When truthy={!readonly}>You can drag and drop new steps to the flow</When>
                    <When truthy={readonly}>You can not drag and drop new steps in Production</When>
                  </Text>
                </NavSection>
                <When truthy={!readonly}>
                  <Stack>
                    {channels.map((channel) => (
                      <div
                        key={channel.tabKey}
                        data-test-id={`dnd-${channel.testId}`}
                        onDragStart={(event) => {
                          setDragging(true);
                          onDragStart(event, channel.channelType);
                        }}
                        onDragEnd={() => {
                          setDragging(false);
                        }}
                        draggable
                      >
                        <DragButton Icon={channel.Icon} description={channel.description} label={channel.label} />
                      </div>
                    ))}
                  </Stack>
                </When>
              </StyledNav>
            )}
          </SideBarWrapper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default WorkflowEditorPage;

const SideBarWrapper = styled.div<{ dark: boolean }>`
  background-color: ${({ dark }) => (dark ? colors.B17 : colors.white)};
  height: 100%;
`;

const StyledNav = styled.div`
  padding: 15px 20px;
  height: 100%;
`;

const NavSection = styled.div`
  padding-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditTemplateButton = styled(Button)`
  background-color: transparent;
`;
