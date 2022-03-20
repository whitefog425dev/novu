import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ChannelTypeEnum, providers, IConfigCredentials } from '@notifire/shared';
import { Modal, useMantineColorScheme, Image } from '@mantine/core';
import PageHeader from '../../components/layout/components/PageHeader';
import PageContainer from '../../components/layout/components/PageContainer';
import { ChannelGroup } from './components/ChannelGroup';
import { ConnectIntegrationForm } from './components/ConnectIntegrationForm';
import { useIntegrations } from '../../api/hooks/use-integrations';

export function IntegrationsStore() {
  const { integrations, loading: isLoading, refetch } = useIntegrations();
  const [emailProviders, setEmailProviders] = useState<IIntegratedProvider[]>([]);
  const [smsProvider, setSmsProvider] = useState<IIntegratedProvider[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [isCreateIntegrationModal, setIsCreateIntegrationModal] = useState(false);
  const [provider, setProvider] = useState<IIntegratedProvider | null>(null);

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const logoSrc = provider ? `/static/images/providers/${isDark ? 'dark' : 'light'}/${provider.providerId}.png` : '';

  async function handlerVisible(visible: boolean, createIntegrationModal: boolean, providerConfig: any) {
    setIsOpened(visible);
    setProvider(providerConfig);
    setIsCreateIntegrationModal(createIntegrationModal);
  }

  async function handlerShowModal(showModal: boolean) {
    await setIsOpened(showModal);
    if (!showModal) {
      await refetch();
    }
  }

  useEffect(() => {
    if (integrations) {
      const initializedProviders: IIntegratedProvider[] = providers.map((x) => {
        const integration = integrations.filter((y) => y.providerId === x.id)[0];

        return {
          providerId: x.id,
          integrationId: integration?._id ? integration._id : '',
          displayName: x.displayName,
          channel: x.channel,
          credentials: x.credentials,
          docReference: x.docReference,
          comingSoon: !!x.comingSoon,
          active: integration?.active ? integration.active : false,
          connected: !!integration,
        };
      });

      setEmailProviders(sortProviders(initializedProviders.filter((p) => p.channel === ChannelTypeEnum.EMAIL)));
      setSmsProvider(sortProviders(initializedProviders.filter((p) => p.channel === ChannelTypeEnum.SMS)));
    }
  }, [integrations]);

  return (
    <PageContainer>
      <PageHeader title="Integration Store" />

      <Modal centered size="lg" overflow="inside" opened={isOpened} onClose={() => setIsOpened(false)}>
        <Image radius="md" src={logoSrc} alt={`${provider?.providerId} image`} />
        <ConnectIntegrationForm
          provider={provider}
          showModal={handlerShowModal}
          createModel={isCreateIntegrationModal}
        />
      </Modal>

      <ContentWrapper isLoading={isLoading}>
        <ChannelGroup providers={emailProviders} title="Email" showModalData={handlerVisible} />
        <ChannelGroup providers={smsProvider} title="SMS" showModalData={handlerVisible} />
      </ContentWrapper>
    </PageContainer>
  );
}

const ContentWrapper = styled.div<{ isLoading: boolean }>`
  padding: 0 30px;
`;

const sortProviders = (messyProviders) => {
  return messyProviders
    .sort((x, y) => Number(!x.connected) - Number(!y.connected))
    .sort((a, b) => Number(!a.active) - Number(!b.active));
};

export interface IIntegratedProvider {
  providerId: string;
  integrationId: string;
  displayName: string;
  channel: ChannelTypeEnum;
  credentials: IConfigCredentials[];
  docReference: string;
  comingSoon: boolean;
  active: boolean;
  connected: boolean;
}
