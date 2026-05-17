import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

const variantTextColor: Record<Variant, string> = {
  primary: colors.surface,
  secondary: colors.primary,
  ghost: colors.primary,
  danger: colors.danger,
};

const variantIconColor: Record<Variant, string> = {
  primary: colors.surface,
  secondary: colors.primary,
  ghost: colors.primary,
  danger: colors.danger,
};

function triggerHaptic(variant: Variant) {
  if (Platform.OS !== 'ios') return;
  if (variant === 'primary') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else if (variant === 'danger') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } else {
    Haptics.selectionAsync();
  }
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
  fullWidth,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const textColor = variantTextColor[variant];
  const iconColor = variantIconColor[variant];

  const handlePress = () => {
    triggerHaptic(variant);
    onPress();
  };

  const content = loading ? (
    <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} size="small" />
  ) : (
    <>
      {icon ? <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={18} color={iconColor} /> : null}
      <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </>
  );

  // iOS primary: outer View carries shadow so overflow:hidden on inner Pressable doesn't clip it
  if (Platform.OS === 'ios' && variant === 'primary') {
    return (
      <View style={[styles.shadowWrap, fullWidth && styles.fullWidth, nativeUI.buttonShadow, style]}>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={handlePress}
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
      android_ripple={
        variant === 'primary'
          ? { color: colors.primaryDark, borderless: false }
          : variant === 'danger'
            ? { color: '#FECACA', borderless: false }
            : { color: colors.border, borderless: false }
      }
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        variant === 'primary' && nativeUI.buttonShadow,
        styles.clip,
        isDisabled && styles.disabled,
        Platform.OS !== 'android' && pressed && !isDisabled && styles.pressed,
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
  fullWidth: {
    width: '100%',
  },
  base: {
    alignItems: 'center',
    borderRadius: nativeUI.radius,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: nativeUI.controlHeight,
    paddingHorizontal: 20,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
    ...(Platform.OS === 'ios' ? { borderCurve: 'continuous' } : {}),
  },
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
  danger: {
    backgroundColor: '#FEF2F2',
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  text: {
    fontFamily: nativeUI.fontBold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    maxWidth: '100%',
  },
});
