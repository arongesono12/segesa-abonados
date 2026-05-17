import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '@/theme/colors';

type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};

export function AppTextField({ label, error, helperText, style, onFocus, onBlur, ...props }: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <Text style={{
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
      }}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        autoCorrect={false}
        returnKeyType="done"
        placeholderTextColor={colors.muted}
        style={[{
          backgroundColor: colors.surface,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 8,
          borderCurve: 'continuous',
          borderWidth: 1,
          color: colors.text,
          fontSize: 16,
          minHeight: 52,
          paddingHorizontal: 14,
        }, style]}
        {...props}
      />
      {error ? <Text style={{
        color: colors.danger,
        fontSize: 13,
      }}>
        {error}
      </Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
