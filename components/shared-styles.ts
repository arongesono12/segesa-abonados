import { Platform, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

export const sharedStyles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontFamily,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
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
    // paddingVertical keeps text vertically centred on Android
    paddingVertical: Platform.OS === 'android' ? 14 : 0,
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
    fontFamily: nativeUI.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    fontFamily: nativeUI.fontFamily,
    fontSize: 13,
  },
});
