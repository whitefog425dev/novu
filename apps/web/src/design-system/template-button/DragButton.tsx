import React, { useState } from 'react';
import { UnstyledButton, Group, Popover } from '@mantine/core';
import styled from '@emotion/styled';
import { Text } from '../typography/text/Text';
import { Switch } from '../switch/Switch';
import { useStyles } from './TemplateButton.styles';
import { colors } from '../config';

interface IDragButtonProps {
  Icon: React.FC<any>;
  description: string;
  label: string;
  tabKey?: string;
  testId?: string;
  readonly?: boolean;
}

export function DragButton({ description, tabKey, readonly = false, label, Icon, testId }: IDragButtonProps) {
  const { cx, classes, theme } = useStyles();

  return (
    <>
      <Button data-test-id={testId} className={cx(classes.button, { [classes.active]: false })}>
        <ButtonWrapper>
          <LeftContainerWrapper>
            <IconWrapper className={classes.linkIcon}>
              <Icon />
            </IconWrapper>
            <StyledContentWrapper>
              <Text weight="bold">{label}</Text>
              <Text mt={3} color={colors.B60}>
                {description}
              </Text>
            </StyledContentWrapper>
          </LeftContainerWrapper>
        </ButtonWrapper>
      </Button>
    </>
  );
}

const IconWrapper = styled.div`
  padding-right: 15px;

  @media screen and (max-width: 1400px) {
    padding-right: 5px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const LeftContainerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledContentWrapper = styled.div`
  padding-right: 10px;
`;

const Button = styled(UnstyledButton)`
  position: relative;
  border: 1px dashed ${colors.B30} !important;

  @media screen and (max-width: 1400px) {
    padding: 0 5px;
  }
`;
