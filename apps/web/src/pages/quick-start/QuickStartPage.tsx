import { Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../components/layout/components/PageMeta';
import PageContainer from '../../components/layout/components/PageContainer';
import { colors, Text, Title } from '../../design-system';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { updateUserOnBoarding } from '../../api/user';
import { IUserEntity } from '@novu/shared';
import { OnboardingSteps } from './components/OnboardingSteps';

function QuickStart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: updateOnBoardingStatus } = useMutation<
    IUserEntity,
    { error: string; message: string; statusCode: number },
    { onBoarding: boolean }
  >(({ onBoarding }) => updateUserOnBoarding(onBoarding));

  async function disableOnboarding() {
    await updateOnBoardingStatus({ onBoarding: false });
  }

  async function onDismissOnboarding() {
    await disableOnboarding();
    await queryClient.refetchQueries('/v1/users/me');
    navigate('/templates');
  }

  return (
    <PageContainer>
      <PageMeta title="Getting Started" />
      <div style={{ padding: '40px' }}>
        <Center>
          <Title>Welcome to Novu!</Title>
        </Center>
        <Center>
          <Text my={10} color={colors.B60}>
            Let's get you started
          </Text>
        </Center>
      </div>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <OnboardingSteps onFinishedAll={disableOnboarding} />
      </div>
      <Center>
        <Text my={40} color={colors.B60}>
          <div onClick={onDismissOnboarding}>Don't show onboarding guide</div>
        </Text>
      </Center>
    </PageContainer>
  );
}

export default QuickStart;
