import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { sharedStyles } from '@/components/shared-styles';
import { colors } from '@/theme/colors';

type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};

export function AppTextField({ label, error, helperText, style, onFocus, onBlur, ...props }: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
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
      {!error && helperText ? <Text style={sharedStyles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
