import React from 'react';
import { Grid } from '@mantine/core';
import { ProviderCard } from './ProviderCard';
import { Title } from '../../../design-system';
import { IIntegratedProvider } from '../IntegrationsStorePage';

export function ChannelGroup({
  title,
  providers,
  onProviderClick,
}: {
  providers: IIntegratedProvider[];
  title: string;
  onProviderClick: (visible: boolean, create: boolean, provider: IIntegratedProvider) => void;
}) {
  function handlerOnConnectClick(visible: boolean, create: boolean, provider: IIntegratedProvider) {
    onProviderClick(visible, create, provider);
  }

  return (
    <Grid mb={50}>
      <Grid.Col span={12} data-test-id={`integration-group-${title.toLowerCase()}`}>
        <Title size={2}>{title}</Title>
      </Grid.Col>
      {providers.map((provider) => (
        <Grid.Col span={3} key={provider.providerId}>
          <ProviderCard provider={provider} onConnectClick={handlerOnConnectClick} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
