import { Controller, useFormContext } from 'react-hook-form';
import { Input, Select } from '../../../design-system';
import { useEnvController } from '../../../store/use-env-controller';

export const DigestMetadata = ({ control, index }) => {
  const { readonly } = useEnvController();
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={`steps.${index}.metadata.unit`}
        render={({ field }) => {
          return (
            <Select
              disabled={readonly}
              error={errors?.steps ? errors.steps[index]?.metadata?.unit?.message : undefined}
              label="Time unit"
              placeholder="Time unit"
              data={[
                { value: 'minutes', label: 'Minutes' },
                { value: 'hours', label: 'Hours' },
                { value: 'days', label: 'Days' },
              ]}
              data-test-id="time-unit"
              {...field}
            />
          );
        }}
      />
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
    </>
  );
};
