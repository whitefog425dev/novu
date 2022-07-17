import { Popover, useMantineColorScheme } from '@mantine/core';
import { colors } from '../../../design-system';
import React from 'react';
import { ButtonsTemplates } from './ButtonsTemplates';
import { IMessageAction, IMessageButton, MessageActionStatusEnum } from '@novu/shared';

interface IButtonsTemplatesPopoverProps {
  isVisible: boolean;
  setIsPopoverVisible: (boolean) => void;
  setTemplateSelected: (boolean) => void;
  children: JSX.Element;
  onChange: (data: any) => void;
  value: IMessageAction;
}

export function ButtonsTemplatesPopover(props: IButtonsTemplatesPopoverProps) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  function handleOnButtonChange(buttons: IMessageButton[]) {
    if (buttons) {
      const newAction = { buttons: buttons, status: MessageActionStatusEnum.PENDING };
      props.onChange(newAction);
    }
  }

  return (
    <Popover
      opened={props.isVisible}
      onClose={() => props.setIsPopoverVisible(false)}
      target={props.children}
      position={'bottom'}
      placement={'center'}
      withArrow
      styles={{
        root: {
          width: '100%',
        },
        inner: { margin: 0, padding: 0 },
        arrow: {
          backgroundColor: dark ? colors.B20 : colors.white,
          height: '-22px',
          border: 'none',
          margin: '0px',
        },
        body: {
          backgroundColor: dark ? colors.B20 : colors.white,
          color: dark ? colors.white : colors.B40,
          border: 'none',
          marginTop: '1px',
          width: '100%',
        },
      }}
    >
      <ButtonsTemplates
        setTemplateSelected={props.setTemplateSelected}
        setIsPopoverVisible={props.setIsPopoverVisible}
        setSelectedTemplate={handleOnButtonChange}
      />
    </Popover>
  );
}
