import { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { sharedStyles } from '@/components/shared-styles';
import { colors } from '@/theme/colors';

type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function AppTextField({ label, error, style, onFocus, onBlur, ...props }: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <Text style={sharedStyles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCorrect={false}
        returnKeyType="done"
        placeholderTextColor={colors.muted}
        underlineColorAndroid="transparent"
        style={[
          sharedStyles.input,
          isFocused && sharedStyles.inputFocused,
          error ? sharedStyles.inputError : null,
          style,
        ]}
        onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
        {...props}
      />
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
    </View>
  );
}
