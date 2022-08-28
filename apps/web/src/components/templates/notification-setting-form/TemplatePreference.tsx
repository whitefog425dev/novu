import { Grid, InputWrapper, useMantineColorScheme } from '@mantine/core';
import { useEnvController } from '../../../store/use-env-controller';
import { inputStyles } from '../../../design-system/config/inputs.styles';
import { Checkbox, colors, Switch } from '../../../design-system';
import styled from 'styled-components';
import { channels } from '../../../pages/templates/shared/channels';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

export function TemplatePreference() {
  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <ChannelPreference />
        </Grid.Col>
        <Grid.Col span={6}>
          <CriticalPreference />
        </Grid.Col>
      </Grid>
    </>
  );
}

export function ChannelPreference() {
  const { control } = useFormContext();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Controller
      name="preferenceSettings"
      control={control}
      render={({ field }) => {
        const { readonly } = useEnvController();

        const preferences = field.value;
        const mock = { email: true, sms: true, in_app: true, chat: true, push: true };
        const data = Object.assign({}, mock, preferences);

        function handleCheckboxChange(e, channelType) {
          const newData = Object.assign({}, preferences);
          newData[channelType] = e.currentTarget.checked;
          field.onChange(newData);
        }

        return (
          <InputBackground
            dark={dark}
            label="Template Defaults"
            description="Check the channels you would like to be ON by default"
            styles={inputStyles}
          >
            <Grid pt={8.5}>
              {Object.keys(data).map((key) => {
                const label = channels.find((channel) => channel.tabKey === key)?.label;
                const checked = data[key] || false;

                return (
                  <Grid.Col md={6} lg={4}>
                    <StyledCheckbox
                      isChecked={checked}
                      checked={checked}
                      disabled={readonly}
                      data-test-id={`preference-${key}`}
                      label={label}
                      onChange={(e) => handleCheckboxChange(e, key)}
                    />
                  </Grid.Col>
                );
              })}
            </Grid>
          </InputBackground>
        );
      }}
    />
  );
}

export function CriticalPreference() {
  const { control } = useFormContext();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Controller
      name="critical"
      control={control}
      render={({ field }) => {
        return (
          <>
            <InputBackground
              dark={dark}
              label="System Critical (Always Sent)"
              description={<CriticalDescription field={field} />}
              styles={inputStyles}
            />
          </>
        );
      }}
    />
  );
}

function CriticalDescription({ field }) {
  const { readonly } = useEnvController();

  return (
    <DescriptionWrapper>
      {field.value
        ? 'Users will get your messages no matter what.'
        : 'Users will be able to unsubscribe from channels.'}
      <Switch {...field} checked={field.value || false} disabled={readonly} data-test-id="critical" />
    </DescriptionWrapper>
  );
}

const InputBackground = styled(InputWrapperProxy)<{ dark }>`
  background: ${({ dark }) => (dark ? colors.B17 : colors.B98)};
  border-radius: 7px;
  padding: 20px;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledCheckbox = styled(CheckboxProxy)<{ isChecked }>`
  label {
    ${({ isChecked }) =>
      !isChecked &&
      `
    color: ${colors.B60}
  `}
  }
`;

export function InputWrapperProxy({ children, ...props }) {
  return <InputWrapper {...props}>{children}</InputWrapper>;
}

export function CheckboxProxy({ ...props }) {
  return <Checkbox {...props} />;
}
