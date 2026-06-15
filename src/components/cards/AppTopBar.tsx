import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { PlatformIcon } from '@/components/platform-icon';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

type AppTopBarProps = {
  title: string;
  subtitle?: string;
  onBellPress?: () => void;
};

export function AppTopBar({ title, subtitle, onBellPress }: AppTopBarProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <SegesaLogo compact light />
        <Pressable accessibilityRole="button" onPress={onBellPress} style={styles.iconButton}>
          <PlatformIcon name="bell-outline" color={colors.surface} size={26} />
          <View style={styles.dot} />
        </Pressable>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    marginHorizontal: -16,
    marginTop: -10,
    minHeight: 252,
    paddingBottom: 78,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  topRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  copy: {
    marginTop: 26,
  },
  title: {
    color: colors.surface,
    fontFamily: nativeUI.fontBlack,
    fontSize: 27,
    fontWeight: '900',
  },
  subtitle: {
    ...fontBase,
    color: '#DCEBFF',
    fontSize: 17,
    marginTop: 4,
  },
  dot: {
    backgroundColor: colors.warning,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    height: 9,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 9,
  },
});
