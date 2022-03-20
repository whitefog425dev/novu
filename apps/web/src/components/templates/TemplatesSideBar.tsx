import { Navbar, useMantineTheme } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import { ChannelTypeEnum } from '@notifire/shared';
import { colors, TemplateButton, Text } from '../../design-system';
import {
  BellGradient,
  MailGradient,
  MobileGradient,
  PlusGradient,
  SmsGradient,
  TapeGradient,
} from '../../design-system/icons';

export function TemplatesSideBar({
  activeChannels,
  activeTab,
  changeTab,
  toggleChannel,
  channelButtons,
  showTriggerSection = false,
  alertErrors,
}: {
  activeChannels: { [p: string]: boolean };
  activeTab: string;
  changeTab: (string) => void;
  toggleChannel: (channel: ChannelTypeEnum, active: boolean) => void;
  channelButtons: string[];
  showTriggerSection: boolean;
  alertErrors: boolean;
  errors: any;
}) {
  const {
    formState: { errors },
  } = useFormContext();
  const templateButtons = [
    {
      tabKey: ChannelTypeEnum.IN_APP,
      label: 'In-App Content',
      description: 'This subtitle will describe things',
      Icon: MobileGradient,
      action: true,
      testId: 'inAppSelector',
      channelType: ChannelTypeEnum.IN_APP,
      areThereErrors: true,
    },
    {
      tabKey: ChannelTypeEnum.EMAIL,
      label: 'Email Template',
      description: 'This subtitle will describe things',
      Icon: MailGradient,
      testId: 'emailSelector',
      channelType: ChannelTypeEnum.EMAIL,
      action: true,
    },
    {
      tabKey: ChannelTypeEnum.SMS,
      label: 'SMS',
      description: 'This subtitle will describe things',
      Icon: SmsGradient,
      testId: 'smsSelector',
      action: true,
      channelType: ChannelTypeEnum.SMS,
    },
  ];

  const links = templateButtons.map(
    (link) =>
      channelButtons.includes(link.tabKey) && (
        <TemplateButton
          {...link}
          active={link.tabKey === activeTab}
          changeTab={changeTab}
          switchButton={(checked) => toggleChannel(link.tabKey, checked)}
          checked={activeChannels[link.tabKey]}
          key={link.tabKey}
        />
      )
  );

  const theme = useMantineTheme();
  const textColor = theme.colorScheme === 'dark' ? colors.B40 : colors.B70;

  return (
    <Navbar mb={20} padding={30} width={{ base: 450 }} sx={{ paddingTop: '0px' }}>
      <Navbar.Section mr={20}>
        <TemplateButton
          tabKey="Settings"
          changeTab={changeTab}
          Icon={BellGradient}
          testId="settingsButton"
          active={activeTab === 'Settings'}
          description="This subtitle will describe things"
          label="Notification Settings"
          areThereErrors={alertErrors && errors.name}
        />
      </Navbar.Section>
      <Navbar.Section mr={20}>
        <Text mt={10} mb={20} color={textColor}>
          Channels
        </Text>
        <div>
          {links}
          <TemplateButton
            tabKey="Add"
            changeTab={changeTab}
            testId="add-channel"
            Icon={PlusGradient}
            active={activeTab === 'Add'}
            description="This subtitle will describe things"
            label="Add Channel"
          />
        </div>
      </Navbar.Section>
      {showTriggerSection && (
        <Navbar.Section mr={20}>
          <Text mt={10} mb={20} color={textColor}>
            Implementation Code
          </Text>
          <div>
            <TemplateButton
              tabKey="TriggerSnippet"
              changeTab={changeTab}
              Icon={TapeGradient}
              active={activeTab === 'TriggerSnippet'}
              description="This subtitle will describe things"
              label="Trigger Snippet"
            />
          </div>
        </Navbar.Section>
      )}
    </Navbar>
  );
}
