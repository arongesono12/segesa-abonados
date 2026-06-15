import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlatformIcon } from '@/components/platform-icon';
import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type ScreenHeaderBarProps = {
  title: string;
  rightIcon?: string;
  onRightPress?: () => void;
};

export function ScreenHeaderBar({ title, rightIcon, onRightPress }: ScreenHeaderBarProps) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.iconButton}>
        <PlatformIcon name="arrow-left" color={colors.primary} size={34} />
      </Pressable>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      <Pressable accessibilityRole="button" onPress={onRightPress} style={styles.iconButton}>
        {rightIcon ? <PlatformIcon name={rightIcon} color={colors.primary} size={32} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 42,
    minHeight: 54,
  },
  iconButton: {
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontFamily: nativeUI.fontBlack,
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
  },
});
