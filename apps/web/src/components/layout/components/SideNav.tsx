import { Navbar, Popover, useMantineColorScheme } from '@mantine/core';
import { colors, NavMenu, SegmentedControl, shadows } from '../../../design-system';
import { Activity, Bolt, Box, Settings, Team, Repeat, CheckCircleOutlined } from '../../../design-system/icons';
import { ChangesCountBadge } from '../../changes/ChangesCountBadge';
import { useEnvController } from '../../../store/use-env-controller';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../store/authContext';
import styled from '@emotion/styled';
import OrganizationSelect from './OrganizationSelect';

type Props = {};

export function SideNav({}: Props) {
  const navigate = useNavigate();
  const { setEnvironment, isLoading, environment, readonly } = useEnvController();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const [opened, setOpened] = useState(readonly);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  useEffect(() => {
    setOpened(readonly);
    if (readonly && location.pathname === '/changes') {
      navigate('/');
    }
  }, [readonly]);

  const menuItems = [
    {
      condition: !readonly && currentUser?.showOnBoarding,
      icon: <CheckCircleOutlined />,
      link: '/quickstart',
      label: 'Getting Started',
      testId: 'side-nav-quickstart-link',
    },
    { icon: <Bolt />, link: '/templates', label: 'Notifications', testId: 'side-nav-templates-link' },
    { icon: <Activity />, link: '/activities', label: 'Activity Feed', testId: 'side-nav-activities-link' },
    { icon: <Box />, link: '/integrations', label: 'Integrations Store', testId: 'side-nav-integrations-link' },
    { icon: <Settings />, link: '/settings', label: 'Settings', testId: 'side-nav-settings-link' },
    {
      icon: <Team />,
      link: '/team',
      label: 'Team Members',
      testId: 'side-nav-settings-organization',
    },
    {
      icon: <Repeat />,
      link: '/changes',
      label: 'Changes',
      testId: 'side-nav-changes-link',
      rightSide: <ChangesCountBadge />,
      condition: !readonly,
    },
  ];

  async function handlePopoverForChanges(e) {
    e.preventDefault();

    await setEnvironment('Development');
    navigate('/changes');
  }

  return (
    <Navbar p={30} sx={{ backgroundColor: 'transparent', borderRight: 'none', paddingRight: 0 }} width={{ base: 300 }}>
      <Navbar.Section mt={20}>
        <Popover
          styles={{
            inner: {
              padding: '12px 20px 14px 15px',
            },
            arrow: {
              backgroundColor: dark ? colors.B20 : colors.white,
              height: '7px',
              border: 'none',
              margin: '0px',
            },
            body: {
              backgroundColor: dark ? colors.B20 : colors.white,
              position: 'relative',
              color: dark ? colors.white : colors.B40,
              border: 'none',
              marginTop: '1px',
            },
          }}
          withArrow
          opened={opened}
          onClose={() => setOpened(false)}
          withCloseButton={true}
          withinPortal={false}
          transition="rotate-left"
          transitionDuration={250}
          placement="center"
          position="right"
          radius="md"
          shadow={dark ? shadows.dark : shadows.medium}
          target={
            <SegmentedControl
              loading={isLoading}
              data={['Development', 'Production']}
              defaultValue={environment?.name}
              value={environment?.name}
              onChange={async (value) => {
                await setEnvironment(value);
              }}
              data-test-id="environment-switch"
            />
          }
        >
          {'To make changes you’ll need to visit '}
          <StyledLink onClick={handlePopoverForChanges}>development changes</StyledLink>{' '}
          {' and promote the changes from there'}
        </Popover>
        <NavMenu menuItems={menuItems} />
      </Navbar.Section>
      <BottomNavWrapper>
        <Navbar.Section>
          <OrganizationSelect />
        </Navbar.Section>
        <BottomNav dark={dark} data-test-id="side-nav-bottom-links">
          <a target="_blank" href="https://discord.gg/novu" data-test-id="side-nav-bottom-link-support">
            Support
          </a>
          <p>
            <b>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;</b>
          </p>
          <a target="_blank" href="https://docs.novu.co" data-test-id="side-nav-bottom-link-documentation">
            Documentation
          </a>
        </BottomNav>
      </BottomNavWrapper>
    </Navbar>
  );
}

const StyledLink = styled.a`
  font-weight: bold;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

const BottomNavWrapper = styled.div`
  margin-top: auto;
  padding-top: 30px;
`;

const BottomNav = styled.div<{ dark: boolean }>`
  color: ${colors.B60};
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 5px;
`;
