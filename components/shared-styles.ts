import { Platform, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

export const sharedStyles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: Platform.select({ ios: 30, android: 28, default: 28 }),
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: Platform.select({ ios: 36, android: 34, default: 34 }),
  },
  subtitle: {
    color: colors.textSoft,
    fontFamily: nativeUI.fontFamily,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1.5,
    color: colors.text,
    fontFamily: nativeUI.fontFamily,
    fontSize: 16,
    minHeight: nativeUI.inputHeight,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 12 : 0,
    ...nativeUI.curveStyle,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  label: {
    color: colors.text,
    fontFamily: nativeUI.fontBold,
    fontSize: 14,
    fontWeight: '800',
  },
  helperText: {
    color: colors.muted,
    fontFamily: nativeUI.fontFamily,
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: colors.danger,
    fontFamily: nativeUI.fontBold,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});
