import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
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
      <View style={styles.header}>
        <Text style={sharedStyles.title}>Elige tu proveedor</Text>
        <Text style={sharedStyles.subtitle}>Selecciona la empresa que emite tus facturas de electricidad.</Text>
      </View>

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="warning-outline" title="No pudimos cargar proveedores" message={error} /> : null}
      {!isLoading && !error && data?.length === 0 ? (
        <EmptyState title="Sin proveedores disponibles" message="Inténtalo de nuevo más tarde." />
      ) : null}

      <View style={styles.list}>
        {data?.map((provider) => {
          const selected = selectedProvider?.id === provider.id;

          return (
            <Pressable
              key={provider.id}
              onPress={() => setSelectedProvider(provider)}
              style={[styles.providerCard, selected && styles.selectedCard]}>
              <View style={[styles.logo, { backgroundColor: provider.logoColor }]}>
                <Text style={styles.logoText}>{provider.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerMeta}>{provider.country} · {provider.supportPhone}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton title="Continuar" disabled={!selectedProvider} onPress={continueToAccount} />
        {error ? <AppButton title="Reintentar" variant="secondary" onPress={refetch} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
  },
  list: {
    gap: 12,
  },
  providerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  logo: {
    alignItems: 'center',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  logoText: {
    color: colors.surface,
    fontWeight: '900',
  },
  providerInfo: {
    flex: 1,
    gap: 4,
  },
  providerName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  providerMeta: {
    color: colors.muted,
    fontSize: 13,
  },
  footer: {
    gap: 10,
    marginTop: 'auto',
  },
});
