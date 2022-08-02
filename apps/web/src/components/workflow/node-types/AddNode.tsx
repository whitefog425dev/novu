import React, { memo } from 'react';
import { colors, Dropdown } from '../../../design-system';
import { ActionIcon, MenuItem as DropdownItem, useMantineTheme } from '@mantine/core';
import { Mail, Mobile, PlusCircleOutlined, Sms } from '../../../design-system/icons';
import { ChannelTypeEnum, StepTypeEnum } from '@novu/shared';
import { Digest } from '../../../design-system/icons/general/Digest';

interface NodeData {
  label: string;
  addNewNode: (parentId: string, type: string) => void;
  parentId: string;
}
export default memo(({ data }: { data: NodeData }) => {
  const theme = useMantineTheme();
  const addNewNode = (type) => {
    data.addNewNode(data.parentId, type);
  };

  return (
    <div data-test-id={`addNodeButton`} style={{ pointerEvents: 'none' }}>
      <Dropdown
        placement="center"
        control={
          <ActionIcon
            data-test-id="button-add"
            styles={() => ({
              root: {
                '&:active': {
                  color: theme.colorScheme === 'dark' ? colors.white : colors.B40,
                },
              },
              transparent: {
                zIndex: 9999,
                pointerEvents: 'all',
                color: theme.colorScheme === 'dark' ? colors.B30 : colors.B80,
                '&:hover': {
                  color: theme.colorScheme === 'dark' ? colors.white : colors.B40,
                },
              },
            })}
            variant="transparent"
          >
            <PlusCircleOutlined />
          </ActionIcon>
        }
      >
        <DropdownItem data-test-id={`add-sms-node`} icon={<Sms />} onClick={() => addNewNode(ChannelTypeEnum.SMS)}>
          SMS
        </DropdownItem>
        <DropdownItem data-test-id={`add-email-node`} icon={<Mail />} onClick={() => addNewNode(ChannelTypeEnum.EMAIL)}>
          Email
        </DropdownItem>
        <DropdownItem data-test-id={`add-push-node`} icon={<Sms />} onClick={() => addNewNode(ChannelTypeEnum.PUSH)}>
          Push
        </DropdownItem>
        <DropdownItem
          data-test-id={`add-direct-node`}
          icon={<Sms />}
          onClick={() => addNewNode(ChannelTypeEnum.DIRECT)}
        >
          Direct
        </DropdownItem>
        <DropdownItem
          data-test-id={`add-in-app-node`}
          icon={<Mobile />}
          onClick={() => addNewNode(ChannelTypeEnum.IN_APP)}
        >
          In-App
        </DropdownItem>
        <DropdownItem
          data-test-id={`add-digest-node`}
          icon={
            /* Hack to manage the size of the SVG, which can't be changed with height and width attributes */
            <div style={{ zoom: 0.65, width: 28, marginLeft: 4 }}>
              <Digest color={theme.colorScheme === 'dark' ? colors.white : colors.B40} />
            </div>
          }
          onClick={() => addNewNode(StepTypeEnum.DIGEST)}
        >
          Digest
        </DropdownItem>
      </Dropdown>
    </div>
  );
});
