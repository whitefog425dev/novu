import { Grid, InputWrapper } from '@mantine/core';
import { DigestUnitEnum } from '@novu/shared';
import { Controller, useFormContext } from 'react-hook-form';
import { Input, Select } from '../../../design-system';
import { inputStyles } from '../../../design-system/config/inputs.styles';
import { useEnvController } from '../../../store/use-env-controller';

export const DigestMetadata = ({ control, index }) => {
  const { readonly } = useEnvController();
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <InputWrapper label="Time Interval" description="Set the time intervals for the batch" styles={inputStyles}>
        <Grid>
          <Grid.Col span={4}>
            <Controller
              control={control}
              name={`steps.${index}.metadata.amount`}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    error={errors?.steps ? errors.steps[index]?.metadata?.amount?.message : undefined}
                    min={0}
                    max={100}
                    type="number"
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Controller
              control={control}
              name={`steps.${index}.metadata.unit`}
              render={({ field }) => {
                return (
                  <Select
                    disabled={readonly}
                    error={errors?.steps ? errors.steps[index]?.metadata?.unit?.message : undefined}
                    placeholder="20"
                    data={[
                      { value: DigestUnitEnum.SECONDS, label: 'Seconds' },
                      { value: DigestUnitEnum.MINUTES, label: 'Minutes' },
                      { value: DigestUnitEnum.HOURS, label: 'Hours' },
                      { value: DigestUnitEnum.DAYS, label: 'Days' },
                    ]}
                    data-test-id="time-unit"
                    {...field}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
      </InputWrapper>
      <Controller
        control={control}
        name={`steps.${index}.metadata.batchkey`}
        render={({ field }) => {
          return (
            <Input
              {...field}
              label="Batch Key"
              placeholder="Property key on payload"
              description="A batch key is used to batch notifications"
              error={errors?.steps ? errors.steps[index]?.metadata?.batchkey?.message : undefined}
              type="text"
            />
          );
        }}
      />
    </>
  );
};
