import styled from '@emotion/styled';
import { Group, useMantineColorScheme } from '@mantine/core';
import { Button, colors, shadows } from '../../../design-system';
import { CardStatusBar } from './CardStatusBar';
import { Settings } from '../../../design-system/icons';
import { IIntegratedProvider } from '../IntegrationsStorePage';
import { IConfigCredentials } from '@novu/shared';

export function ProviderCard({
  provider,
  onConnectClick,
}: {
  provider: IIntegratedProvider;
  onConnectClick: (visible: boolean, create: boolean, provider: IIntegratedProvider) => void;
}) {
  const { colorScheme } = useMantineColorScheme();
  const logoSrc = `/static/images/providers/${colorScheme}/${provider.logoFileName[`${colorScheme}`]}`;
  const brightCard =
    provider.active ||
    provider.credentials.some((cred: IConfigCredentials) => {
      return !cred.value;
    });

  function handleOnClickSettings() {
    onConnectClick(true, false, provider);
  }

  return (
    <StyledCard
      isDark={isDark}
      active={brightCard}
      data-test-id="integration-provider-card"
      onClick={() => {
        if (provider.connected) {
          handleOnClickSettings();
        } else {
          onConnectClick(true, true, provider);
        }
      }}>
      {provider.comingSoon && (
        <RibbonWrapper>
          <ComingSoonRibbon>COMING SOON</ComingSoonRibbon>
        </RibbonWrapper>
      )}
      <StyledGroup position="apart" direction="column">
        <CardHeader>
          <Logo src={logoSrc} alt={provider.displayName} />
          {provider.connected ? <Settings data-test-id="provider-card-settings-svg" /> : null}
        </CardHeader>

        <CardFooter>
          {!provider.connected ? (
            <StyledButton fullWidth variant={'outline'} isDark={isDark}>
              Connect
            </StyledButton>
          ) : (
            <CardStatusBar active={provider.active} />
          )}
        </CardFooter>
      </StyledGroup>
    </StyledCard>
  );
}

const StyledButton = styled(Button)<{ isDark: boolean }>`
  background-image: ${({ isDark }) =>
    isDark
      ? `linear-gradient(0deg, ${colors.B17} 0%, ${colors.B17} 100%),linear-gradient(99deg,#DD2476 0% 0%, #FF512F 100% 100%)`
      : `linear-gradient(0deg, ${colors.B98} 0%, ${colors.B98} 100%),linear-gradient(99deg,#DD2476 0% 0%, #FF512F 100% 100%)`};
`;

const StyledGroup = styled(Group)`
  height: 100%;
  justify-content: space-between;
`;

const RibbonWrapper = styled.div`
  width: 115px;
  height: 115px;
  position: absolute;
  right: 10px;
  top: 10px;
  transform: rotate(45deg);
`;

const ComingSoonRibbon = styled.div`
  background: ${colors.horizontal};
  font-size: 9px;
  width: 100%;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  svg {
    color: ${colors.B40};
  }
`;

const Logo = styled.img`
  max-width: 140px;
  max-height: 50px;
`;

const CardFooter = styled.div`
  width: 100%;
`;

const StyledCard = styled.div<{ isDark: boolean; active: boolean }>`
  background-color: ${({ isDark }) => (isDark ? colors.B17 : colors.B98)};
  border-radius: 7px;
  display: inline-block;
  padding: 25px;
  height: 200px;
  width: 100%;
  min-width: 205px;
  transition: all 0.15s ease-in;
  position: relative;
  overflow: hidden;

  ${({ active }) => {
    return (
      !active &&
      `
      ${Logo} {
        opacity: 0.5;
      }
    `
    );
  }};

  &:hover {
    cursor: pointer;
    ${({ isDark }) =>
      isDark
        ? `
            background-color: ${colors.B20};
            box-shadow: ${shadows.dark};
          `
        : `
            background-color: ${colors.BGLight};
            box-shadow: ${shadows.light};
          `};
  }
`;
