import React from 'react';
import { ActionIcon } from '@mantine/core';
import { ArrowLeft } from '../../../../../shared/icons';
import styled from 'styled-components';
import { useNovuThemeProvider } from '../../../../../hooks';
import { ScreensEnum } from '../Layout';
import { useTranslations } from '../../../../../hooks/use-translations';

export function UserPreferenceHeader({ setScreen }: { setScreen: (screen: ScreensEnum) => void }) {
  const { theme } = useNovuThemeProvider();
  const { t } = useTranslations();

  return (
    <HeaderWrapper>
      <ActionIcon data-test-id="go-back-btn" variant="transparent" onClick={() => setScreen(ScreensEnum.NOTIFICATIONS)}>
        <ArrowLeft style={{ marginLeft: '15px', color: theme.header.fontColor }} />
      </ActionIcon>
      <Title fontColor={theme.header.fontColor}>{t('settings')}</Title>
    </HeaderWrapper>
  );
}

const Title = styled.div<{ fontColor: string }>`
  color: ${({ fontColor }) => fontColor};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  text-align: left;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 55px;
  gap: 10px;
`;
