import styled, { useTheme } from 'styled-components';
import { Badge } from '@mantine/core';
import { colors } from '../../../../../shared/config/colors';
import React from 'react';

export interface IHeaderProps {
  unseenCount: number;
}

export function Header(props: IHeaderProps) {
  const theme: any = useTheme();

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
        <Text>Notifications </Text>
        {props.unseenCount && props.unseenCount > 0 ? (
          <Badge
            data-test-id="unseen-count-label"
            sx={{
              padding: 0,
              width: 20,
              height: 20,
              pointerEvents: 'none',
              border: 'none',
              background: theme.colors.main,
              fontFamily: theme.fontFamily,
              lineHeight: '14px',
              color: colors.white,
              fontWeight: 'bold',
              fontSize: '12px',
            }}
            radius={100}
          >
            {props.unseenCount}
          </Badge>
        ) : null}
      </div>
      <MarkReadAction style={{ display: 'none' }}>Mark all as read</MarkReadAction>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
`;

const Text = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
`;
const MarkReadAction = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
  color: ${colors.B60};
`;
