import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { ElectricityProvider } from '@/types/domain';

export default function ProviderScreen() {
  const [selectedProvider, setSelectedProvider] = useState<ElectricityProvider | null>(null);
  const loadProviders = useCallback(() => electricityApi.getProviders(), []);
  const { data, isLoading, error, refetch } = useApiResource(loadProviders);

  const continueToAccount = () => {
    if (selectedProvider) {
      router.push({ pathname: '/onboarding/account', params: { providerId: selectedProvider.id } });
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Elige tu proveedor" subtitle="Selecciona la empresa que emite tus facturas de electricidad." />

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="alert-outline" title="No pudimos cargar proveedores" message={error} /> : null}
      {!isLoading && !error && data?.length === 0 ? (
        <EmptyState title="Sin proveedores disponibles" message="Inténtalo de nuevo más tarde." />
      ) : null}

      <View style={styles.list}>
        {data?.map((provider) => {
          const selected = selectedProvider?.id === provider.id;

          return (
            <Pressable
              accessibilityRole="button"
              key={provider.id}
              onPress={() => setSelectedProvider(provider)}
              style={({ pressed }) => [styles.providerCard, selected && styles.selectedCard, pressed && styles.pressed]}>
              <View style={[styles.logo, { backgroundColor: provider.logoColor }]}>
                <Text style={styles.logoText}>{provider.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerMeta}>{provider.country} · {provider.supportPhone}</Text>
              </View>
              <View style={[styles.selectionMark, selected && styles.selectionMarkSelected]}>
                {selected ? <Text style={styles.selectionText}>✓</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton title="Continuar" disabled={!selectedProvider} fullWidth onPress={continueToAccount} />
        {error ? <AppButton title="Reintentar" variant="secondary" onPress={refetch} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  providerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.78,
  },
  logo: {
    alignItems: 'center',
    borderRadius: nativeUI.compactRadius,
    height: 48,
    justifyContent: 'center',
    width: 48,
    ...nativeUI.curveStyle,
  },
  logoText: {
    color: colors.surface,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  providerInfo: {
    flex: 1,
    gap: 4,
  },
  providerName: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 16,
    fontWeight: '900',
  },
  providerMeta: {
    ...fontBase,
    color: colors.muted,
    fontSize: 13,
  },
  selectionMark: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  selectionMarkSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectionText: {
    color: colors.surface,
    fontFamily: nativeUI.fontBlack,
    fontSize: 13,
    fontWeight: '900',
  },
  footer: {
    gap: 10,
    marginTop: 'auto',
  },
});
