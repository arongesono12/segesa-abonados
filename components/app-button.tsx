import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function AppButton({ title, onPress, variant = 'primary', icon, loading, disabled, style }: AppButtonProps) {
  const isDisabled = disabled || loading;

  const content = loading ? (
    <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} />
  ) : (
    <>
      {icon ? <Ionicons name={icon} size={19} color={variant === 'primary' ? colors.surface : colors.primary} /> : null}
      <Text style={[styles.text, variant !== 'primary' && styles.textAlt]}>{title}</Text>
    </>
  );

  // On iOS we wrap with a shadow-carrying View so overflow:hidden on the
  // Pressable doesn't clip the shadow. On Android shadow = elevation which
  // works fine inside overflow:hidden.
  if (Platform.OS === 'ios' && variant === 'primary') {
    return (
      <View style={[styles.shadowWrap, nativeUI.buttonShadow, style]}>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={onPress}
          style={({ pressed }) => [
            styles.base,
            styles.primary,
            styles.clip,
            isDisabled && styles.disabled,
            pressed && !isDisabled && styles.pressed,
          ]}>
          {content}
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={variant === 'primary' ? { color: colors.primaryDark } : { color: colors.border }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        variant === 'primary' && nativeUI.buttonShadow,
        styles.clip,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: nativeUI.radius,
  },
  base: {
    alignItems: 'center',
    borderRadius: nativeUI.radius,
    flexDirection: 'row',
    gap: 8,
    minHeight: nativeUI.controlHeight,
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  // Clips Android ripple (and content) to the rounded shape.
  // Safe to apply here because iOS primary uses the shadowWrap path above.
  clip: {
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.86,
  },
  text: {
    color: colors.surface,
    fontFamily: nativeUI.fontFamily,
    fontSize: 16,
    fontWeight: '700',
  },
  textAlt: {
    color: colors.primary,
  },
});
