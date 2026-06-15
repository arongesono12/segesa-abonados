import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlatformIcon } from '@/components/platform-icon';
import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';

type QuickActionProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

export function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <PlatformIcon name={icon} color={colors.primary} size={24} />
      </View>
      <Text numberOfLines={2} style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  label: {
    ...fontBase,
    color: colors.text,
    fontSize: 12,
    lineHeight: 15,
    minHeight: 30,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
