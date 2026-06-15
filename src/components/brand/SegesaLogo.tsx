import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

type SegesaLogoProps = {
  compact?: boolean;
  light?: boolean;
  large?: boolean;
};

export function SegesaLogo({ compact = false, light = false, large = false }: SegesaLogoProps) {
  return (
    <View style={styles.row}>
      <Image source={require('@/assets/images/icon.png')} style={compact ? styles.iconSmall : large ? styles.iconLarge : styles.icon} />
      <View>
        <Text style={[compact ? styles.nameSmall : large ? styles.nameLarge : styles.name, light && styles.lightText]}>SEGESA</Text>
        {!compact ? <Text style={[styles.caption, light && styles.lightCaption]}>Sociedad de Electricidad{'\n'}de Guinea Ecuatorial</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  icon: {
    borderRadius: 16,
    height: 50,
    width: 50,
    ...nativeUI.curveStyle,
  },
  iconLarge: {
    borderRadius: 24,
    height: 78,
    width: 78,
    ...nativeUI.curveStyle,
  },
  iconSmall: {
    borderRadius: 11,
    height: 36,
    width: 36,
    ...nativeUI.curveStyle,
  },
  name: {
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontSize: 28,
    fontWeight: '900',
  },
  nameLarge: {
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontSize: 48,
    fontWeight: '900',
  },
  nameSmall: {
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontSize: 20,
    fontWeight: '900',
  },
  caption: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 10,
    lineHeight: 12,
    maxWidth: 170,
  },
  lightText: {
    color: colors.surface,
  },
  lightCaption: {
    color: colors.surface,
  },
});
