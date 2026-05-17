import { Image, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { colors } from '@/theme/colors';
import { nativeUI } from '@/theme/native-ui';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedImage = Animated.createAnimatedComponent(Image);

type EmptyStateProps = {
  sfIcon?: string;
  title: string;
  message: string;
};

export function EmptyState({ sfIcon = 'checkmark.circle.fill', title, message }: EmptyStateProps) {
  return (
    <AnimatedView
      style={{
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 8,
        borderCurve: 'continuous',
        borderWidth: 1,
        gap: 8,
        padding: 24,
      }}
      entering={FadeIn.duration(300)}>
      <AnimatedImage
        source={{ uri: `sf=${sfIcon}` }}
        style={{ width: 36, height: 36, tintColor: colors.primary }}
        entering={ZoomIn.duration(400).delay(100)}
      />
      <AnimatedText
        style={{ color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' }}
        entering={FadeIn.duration(300).delay(150)}>
        {title}
      </AnimatedText>
      <AnimatedText
        style={{ color: colors.textSoft, fontSize: 14, lineHeight: 20, textAlign: 'center' }}
        entering={FadeIn.duration(300).delay(200)}>
        {message}
      </AnimatedText>
    </AnimatedView>
  );
}
