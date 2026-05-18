import { StyleSheet, Text, View } from 'react-native';

import { PlatformIcon } from '@/components/platform-icon';
import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type EmptyStateProps = {
  icon?: string;
  title: string;
  message: string;
};

export function EmptyState({ icon = 'check-circle-outline', title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <PlatformIcon name={icon} color={colors.primary} size={36} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    gap: 8,
    padding: 24,
    ...nativeUI.curveStyle,
  },
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBold,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.textSoft,
    fontFamily: nativeUI.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
