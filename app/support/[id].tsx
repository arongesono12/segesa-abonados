import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { StatusBadge } from '@/components/cards/StatusBadge';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

export default function SupportTicketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen topInset>
      <Text style={styles.title}>Detalle de consulta</Text>
      <View style={styles.card}>
        <View style={styles.top}>
          <Text style={styles.ticketId}>#{id ?? 'INC-2026-0152'}</Text>
          <StatusBadge label="En proceso" tone="info" />
        </View>
        <Text style={styles.subject}>Factura incorrecta</Text>
        <Text style={styles.description}>
          La factura de mayo muestra un consumo mas alto de lo habitual. Solicito revision.
        </Text>
      </View>

      <Text style={styles.section}>Mensajes</Text>
      <View style={styles.messageClient}>
        <Text style={styles.messageLabel}>Cliente</Text>
        <Text style={styles.messageText}>Hola, por favor revisen mi factura.</Text>
      </View>
      <View style={styles.messageAgent}>
        <Text style={styles.messageLabel}>Agente SEGESA</Text>
        <Text style={styles.messageText}>Estamos revisando tu caso y te daremos respuesta pronto.</Text>
      </View>

      <View style={styles.composer}>
        <TextInput placeholder="Escribe un mensaje..." placeholderTextColor={colors.muted} style={styles.input} />
        <View style={styles.send}><Text style={styles.sendText}>↗</Text></View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  top: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketId: {
    ...fontBase,
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  subject: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 15,
    fontWeight: '900',
  },
  description: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 14,
    fontWeight: '900',
  },
  messageClient: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    maxWidth: '82%',
    padding: 12,
  },
  messageAgent: {
    alignSelf: 'flex-end',
    backgroundColor: '#DDF8E8',
    borderRadius: 10,
    maxWidth: '82%',
    padding: 12,
  },
  messageLabel: {
    ...fontBase,
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
  },
  messageText: {
    ...fontBase,
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
  },
  composer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  send: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sendText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
  },
});
