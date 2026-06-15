import { ComponentProps } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { AppTextField } from '@/components/app-text-field';

type FormTextFieldProps<TValues extends FieldValues> = Omit<
  ComponentProps<typeof AppTextField>,
  'error' | 'onBlur' | 'onChangeText' | 'value'
> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export function FormTextField<TValues extends FieldValues>({
  control,
  name,
  ...textFieldProps
}: FormTextFieldProps<TValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppTextField
          {...textFieldProps}
          error={fieldState.error?.message}
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          value={field.value}
        />
      )}
    />
  );
}
