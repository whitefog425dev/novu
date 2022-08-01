import styled from 'styled-components';
import { Loader } from '../Loader';
import { HeaderContainer as Header } from './header/HeaderContainer';
import { FooterContainer as Footer } from './footer/FooterContainer';
import React from 'react';
import { useNovuContext } from '../../../../hooks';
import { useNovuThemeProvider } from '../../../../hooks/use-novu-theme-provider.hook';
import { INovuTheme } from '../../../../store/novu-theme.context';

export function Layout({ children }: { children: JSX.Element }) {
  const { initialized } = useNovuContext();
  const { theme } = useNovuThemeProvider();

  return (
    <LayoutWrapper theme={theme}>
      <Header />
      <ContentWrapper>{initialized ? children : <Loader />}</ContentWrapper>
      <Footer />
    </LayoutWrapper>
  );
}

const ContentWrapper = styled.div`
  overflow: auto;
  min-height: 400px;
`;

const LayoutWrapper = styled.div<{ theme: INovuTheme }>`
  padding: 15px 0;
  height: auto;
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.layout.boxShadow};
  background: ${({ theme }) => theme.layout.background};
`;
