import { Text, TextInput, TextInputProps, View } from 'react-native';

import { sharedStyles } from '@/components/shared-styles';
import { colors } from '@/theme/colors';

type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function AppTextField({ label, error, style, ...props }: AppTextFieldProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={sharedStyles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[sharedStyles.input, error ? { borderColor: colors.danger } : null, style]}
        {...props}
      />
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
    </View>
  );
}
