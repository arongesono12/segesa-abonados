import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type AppIconName =
  | 'account-outline'
  | 'account-plus-outline'
  | 'alert-outline'
  | 'apple'
  | 'check'
  | 'check-circle-outline'
  | 'chevron-right'
  | 'clock-outline'
  | 'credit-card-outline'
  | 'download-outline'
  | 'email-outline'
  | 'file-document-outline'
  | 'filter-outline'
  | 'google'
  | 'headset'
  | 'home-outline'
  | 'lightning-bolt'
  | 'lightning-bolt-outline'
  | 'login'
  | 'logout'
  | 'menu'
  | 'message-text-outline'
  | 'bell-outline'
  | 'person-add-outline'
  | 'plus-circle-outline'
  | 'receipt-outline'
  | 'refresh'
  | 'shield-check'
  | 'share-variant-outline'
  | 'star-outline'
  | 'view-dashboard-outline';

const iosSymbols: Partial<Record<AppIconName, SymbolViewProps['name']>> = {
  'account-outline': 'person.crop.circle',
  'account-plus-outline': 'person.crop.circle.badge.plus',
  'alert-outline': 'exclamationmark.triangle',
  apple: 'apple.logo',
  check: 'checkmark',
  'check-circle-outline': 'checkmark.circle',
  'chevron-right': 'chevron.right',
  'clock-outline': 'clock',
  'credit-card-outline': 'creditcard',
  'download-outline': 'arrow.down.doc',
  'email-outline': 'envelope',
  'file-document-outline': 'doc.text',
  'filter-outline': 'line.3.horizontal.decrease',
  headset: 'headphones',
  'home-outline': 'house',
  'lightning-bolt': 'bolt.fill',
  'lightning-bolt-outline': 'bolt',
  login: 'rectangle.portrait.and.arrow.right',
  logout: 'rectangle.portrait.and.arrow.right',
  menu: 'line.3.horizontal',
  'message-text-outline': 'message',
  'bell-outline': 'bell',
  'person-add-outline': 'person.crop.circle.badge.plus',
  'plus-circle-outline': 'plus.circle',
  'receipt-outline': 'doc.text',
  refresh: 'arrow.clockwise',
  'shield-check': 'checkmark.shield',
  'share-variant-outline': 'square.and.arrow.up',
  'star-outline': 'star',
  'view-dashboard-outline': 'square.grid.2x2',
};

type PlatformIconProps = {
  name: AppIconName | string;
  color: string;
  size?: number;
  weight?: SymbolWeight;
  style?: StyleProp<TextStyle | ViewStyle>;
};

export function PlatformIcon({ name, color, size = 22, weight = 'regular', style }: PlatformIconProps) {
  const iosName = iosSymbols[name as AppIconName];

  if (Platform.OS === 'ios' && iosName) {
    return (
      <SymbolView
        name={iosName}
        resizeMode="scaleAspectFit"
        style={[{ height: size, width: size }, style as StyleProp<ViewStyle>]}
        tintColor={color}
        weight={weight}
      />
    );
  }

  return (
    <MaterialCommunityIcons
      color={color}
      name={name as keyof typeof MaterialCommunityIcons.glyphMap}
      size={size}
      style={style as StyleProp<TextStyle>}
    />
  );
}
