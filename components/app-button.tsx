import { ActivityIndicator, Image, Pressable, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedImage = Animated.createAnimatedComponent(Image);

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  sfIcon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export function AppButton({ title, onPress, variant = 'primary', sfIcon, loading, disabled, style }: AppButtonProps) {
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.96);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      const haptics = require('expo-haptics');
      haptics.impactAsync(haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      android_ripple={
        variant === 'primary'
          ? { color: colors.primaryDark, borderless: false }
          : variant === 'danger'
            ? { color: '#FECACA', borderless: false }
            : { color: colors.border, borderless: false }
      }
      disabled={isDisabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          alignItems: 'center',
          backgroundColor: variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.surfaceAlt : 'transparent',
          borderColor: variant === 'secondary' ? colors.border : 'transparent',
          borderRadius: 8,
          borderCurve: 'continuous',
          borderWidth: variant === 'secondary' ? 1 : 0,
          flexDirection: 'row',
          gap: 8,
          height: 52,
          justifyContent: 'center',
          paddingHorizontal: 16,
          opacity: isDisabled ? 0.55 : 1,
        },
        animatedStyle,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} />
      ) : (
        <>
          {sfIcon ? (
            <AnimatedImage
              source={{ uri: `sf=${sfIcon}` }}
              style={{
                width: 19,
                height: 19,
                tintColor: variant === 'primary' ? colors.surface : colors.primary,
              }}
            />
          ) : null}
          <AnimatedText style={{
            color: variant === 'primary' ? colors.surface : colors.primary,
            fontSize: 16,
            fontWeight: '700',
          }}>
            {title}
          </AnimatedText>
        </>
      )}
    </AnimatedPressable>
  );
}
