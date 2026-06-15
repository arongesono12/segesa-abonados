import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

type Slide = {
  title: string;
  description: string;
  button: string;
};

const slides: Slide[] = [
  {
    title: 'Bienvenido',
    description: 'La forma mas facil de gestionar tus\nfacturas de electricidad.',
    button: 'Comenzar',
  },
  {
    title: 'Consulta tus facturas',
    description: 'Visualiza, descarga y comparte tus\nfacturas de forma rapida.',
    button: 'Siguiente',
  },
  {
    title: 'Paga en linea',
    description: 'Realiza tus pagos de forma segura\ncon multiples metodos.',
    button: 'Siguiente',
  },
];

export default function WelcomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const compact = height < 760;
  const scale = Math.min(1, Math.max(0.76, height / 860));
  const activeSlide = slides[activeIndex];

  const heroHeight = Math.min(width * 0.64, height * (compact ? 0.3 : 0.34));
  const illustrationSize = Math.min(width * 0.78, compact ? 272 : 360);
  const logoTop = Math.round((compact ? 30 : 54) * scale);
  const visualTop = Math.round((compact ? 34 : 58) * scale);
  const copyTop = Math.round((compact ? 34 : 54) * scale);
  const dotsTop = Math.round((compact ? 30 : 48) * scale);
  const buttonTop = Math.round((compact ? 30 : 50) * scale);
  const titleSize = compact ? 25 : 32;
  const bodySize = compact ? 18 : 22;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex((value) => value + 1);
      return;
    }
    router.push('/auth/login');
  };

  return (
    <Screen scroll={false} topInset>
      <View style={styles.container}>
        {activeIndex === 0 ? (
          <>
            <Image
              source={require('../../public/images/1pic.png')}
              resizeMode="contain"
              style={[styles.heroImage, { height: heroHeight, marginTop: Math.round((compact ? 20 : 34) * scale), width: width + 28 }]}
            />
            <View style={[styles.logoWrap, { marginTop: Math.round((compact ? 32 : 46) * scale) }]}>
              <SegesaLogo large={!compact} />
            </View>
          </>
        ) : (
          <>
            <View style={[styles.logoWrap, { marginTop: logoTop }]}>
              <SegesaLogo />
            </View>
            <Image
              source={activeIndex === 1 ? require('../../public/images/phone.png') : require('../../public/images/cardSheld.png')}
              resizeMode="contain"
              style={[styles.illustrationImage, { height: illustrationSize, marginTop: visualTop, width: illustrationSize }]}
            />
          </>
        )}

        <View style={[styles.copy, { marginTop: copyTop }]}>
          <Text style={[styles.slideTitle, { fontSize: titleSize }]}>{activeSlide.title}</Text>
          <Text style={[styles.slideText, { fontSize: bodySize, lineHeight: Math.round(bodySize * 1.42) }]}>
            {activeSlide.description}
          </Text>
        </View>

        <View style={[styles.dots, { marginTop: dotsTop }]}>
          {slides.map((slide, index) => (
            <Pressable
              accessibilityRole="button"
              key={slide.title}
              onPress={() => setActiveIndex(index)}
              style={[styles.dot, activeIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <AppButton
          title={activeSlide.button}
          onPress={handleNext}
          style={[styles.button, { marginTop: buttonTop, minHeight: compact ? 58 : 64 }]}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heroImage: {
    marginHorizontal: -14,
  },
  logoWrap: {
    alignItems: 'center',
  },
  illustrationImage: {
    marginHorizontal: -14,
  },
  copy: {
    alignItems: 'center',
  },
  slideTitle: {
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
    textAlign: 'center',
  },
  slideText: {
    ...fontBase,
    color: colors.textSoft,
    marginTop: 20,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
  },
  dot: {
    backgroundColor: '#D7DBE2',
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  button: {
    alignSelf: 'stretch',
    marginHorizontal: 34,
  },
});
