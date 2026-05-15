import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { ElectricityProvider } from '@/types/domain';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function ProviderScreen() {
  const [selectedProvider, setSelectedProvider] = useState<ElectricityProvider | null>(null);
  const loadProviders = useCallback(() => electricityApi.getProviders(), []);
  const { data, isLoading, error, refetch } = useApiResource(loadProviders);

  const continueToAccount = () => {
    if (selectedProvider && process.env.EXPO_OS === 'ios') {
      const haptics = require('expo-haptics');
      haptics.impactAsync(haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <Screen>
      <AnimatedView style={{ gap: 10 }} entering={FadeIn.duration(300)}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
          Elige tu proveedor
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
          Selecciona la empresa que emite tus facturas de electricidad.
        </Text>
      </AnimatedView>

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState sfIcon="exclamationmark.triangle.fill" title="No pudimos cargar proveedores" message={error} /> : null}
      {!isLoading && !error && data?.length === 0 ? (
        <EmptyState sfIcon="square.grid.3x3" title="Sin proveedores disponibles" message="Inténtalo de nuevo más tarde." />
      ) : null}

      <AnimatedView style={{ gap: 12 }} entering={FadeIn.duration(300).delay(100)}>
        {data?.map((provider, index) => {
          const selected = selectedProvider?.id === provider.id;

          return (
            <Pressable
              accessibilityRole="button"
              key={provider.id}
              onPress={() => setSelectedProvider(provider)}
              style={{
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderColor: selected ? colors.primary : colors.border,
                borderRadius: 8,
                borderCurve: 'continuous',
                borderWidth: selected ? 2 : 1,
                flexDirection: 'row',
                gap: 14,
                padding: 14,
              }}>
              <View style={{
                alignItems: 'center',
                backgroundColor: provider.logoColor,
                borderRadius: 8,
                borderCurve: 'continuous',
                height: 46,
                justifyContent: 'center',
                width: 46,
              }}>
                <Text style={{ color: colors.surface, fontWeight: '900' }}>
                  {provider.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800' }}>
                  {provider.name}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>
                  {provider.country} · {provider.supportPhone}
                </Text>
              </View>
              <View style={[styles.selectionMark, selected && styles.selectionMarkSelected]}>
                {selected ? <Text style={styles.selectionText}>✓</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </AnimatedView>

      <AnimatedView style={{ gap: 10 }} entering={FadeIn.duration(300).delay(150)}>
        <AppButton title="Continuar" disabled={!selectedProvider} onPress={continueToAccount} />
        {error ? <AppButton title="Reintentar" sfIcon="arrow.clockwise" variant="secondary" onPress={refetch} /> : null}
      </AnimatedView>
    </Screen>
  );
}
