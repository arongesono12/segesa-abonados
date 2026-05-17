import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type ActionRowProps = {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
};

export function ActionRow({ title, subtitle, icon, onPress, destructive }: ActionRowProps) {
  const tint = destructive ? colors.danger : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: destructive ? '#FEF2F2' : colors.surfaceAlt }]}>
        <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} color={tint} size={20} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: destructive ? colors.danger : colors.text }]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" color={colors.muted} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  pressed: {
    opacity: 0.72,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: nativeUI.compactRadius,
    height: 38,
    justifyContent: 'center',
    width: 38,
    ...nativeUI.curveStyle,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: nativeUI.fontBold,
    fontSize: 15,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontFamily: nativeUI.fontFamily,
    fontSize: 13,
    lineHeight: 18,
  },
});
