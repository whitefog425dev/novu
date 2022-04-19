import { useState, useContext } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Navbar } from '@mantine/core';
import { IEnvironment } from '@novu/shared';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { getMyEnvironments, getCurrentEnvironment } from '../../../api/environment';
import { api } from '../../../api/api.client';
import { NavMenu, SegmentedControl } from '../../../design-system';
import { Activity, Bolt, Box, Settings, Team } from '../../../design-system/icons';
import { AuthContext } from '../../../store/authContext';

type Props = {};
const menuItems = [
  { icon: <Bolt />, link: '/templates', label: 'Notifications', testId: 'side-nav-templates-link' },
  { icon: <Activity />, link: '/activities', label: 'Activity Feed', testId: 'side-nav-activities-link' },
  { icon: <Box />, link: '/integrations', label: 'Integration Store', testId: 'side-nav-integrations-link' },
  { icon: <Settings />, link: '/settings', label: 'Settings', testId: 'side-nav-settings-link' },
  {
    icon: <Team />,
    link: '/team',
    label: 'Team Members',
    testId: 'side-nav-settings-organization',
  },
];

export function SideNav({}: Props) {
  const queryClient = useQueryClient();
  const { setToken, jwtPayload } = useContext(AuthContext);
  const { data: environments, isLoading: isLoadingMyEnvironments } = useQuery<IEnvironment[]>(
    'myEnvironments',
    getMyEnvironments
  );
  const { data: environment, isLoading: isLoadingCurrentEnvironment } = useQuery<IEnvironment>(
    'currentEnvironment',
    getCurrentEnvironment
  );
  const [isLoading, setIsLoading] = useStateWithCallbackLazy(false);

  function changeEnvironment(environmentName: string) {
    if (isLoading || isLoadingMyEnvironments || isLoadingCurrentEnvironment) {
      return;
    }

    const targetEnvironment = environments?.find((_environment) => _environment.name === environmentName);
    if (!targetEnvironment) {
      return;
    }

    setIsLoading(true, () => {
      api
        .post(`/v1/auth/environments/${targetEnvironment?._id}/switch`, {})
        .then((tokenResponse) => {
          setToken(tokenResponse.token);

          return tokenResponse;
        })
        .then(() => {
          // eslint-disable-next-line promise/no-nesting
          queryClient.refetchQueries().then(() => {
            setIsLoading(false, () => {});

            return false;
          });

          return true;
        });
    });
  }

  return (
    <Navbar p={30} sx={{ backgroundColor: 'transparent', borderRight: 'none', paddingRight: 0 }} width={{ base: 300 }}>
      <Navbar.Section>
        <SegmentedControl
          loading={isLoadingMyEnvironments || isLoadingCurrentEnvironment || isLoading}
          data={['Development', 'Production']}
          defaultValue={environment?.name}
          value={environment?.name}
          onChange={(value) => {
            changeEnvironment(value);
          }}
          data-test-id="environment-switch"
        />
        <NavMenu menuItems={menuItems} />
      </Navbar.Section>
    </Navbar>
  );
}
