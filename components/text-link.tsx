import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type TextLinkProps = {
  title: string;
  onPress: () => void;
  align?: 'left' | 'center';
  style?: ViewStyle;
};

export function TextLink({ title, onPress, align = 'center', style }: TextLinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [styles.base, align === 'left' && styles.left, pressed && styles.pressed, style]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    alignSelf: 'center',
    minHeight: 28,
    paddingHorizontal: 2,
    paddingVertical: 3,
  },
  left: {
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.62,
  },
  text: {
    fontFamily: nativeUI.fontBold,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 20,
  },
});
