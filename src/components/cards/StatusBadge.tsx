import { StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';

type StatusBadgeProps = {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
};

const toneStyles = {
  danger: { backgroundColor: '#FEE4E2', color: colors.danger },
  info: { backgroundColor: colors.primaryLight, color: colors.primary },
  neutral: { backgroundColor: '#EEF2F6', color: colors.textSoft },
  success: { backgroundColor: colors.successLight, color: colors.success },
  warning: { backgroundColor: colors.warningLight, color: colors.warning },
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return <Text style={[styles.badge, toneStyles[tone]]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    ...fontBase,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
