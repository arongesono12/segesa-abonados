import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { useNotifications } from '@/hooks/useNotifications';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

const tickets = [
  { id: 'INC-2026-0152', title: 'Factura incorrecta', date: '12/06/2026', tone: 'warning' as const, status: 'En proceso' },
  { id: 'INC-2026-0138', title: 'Pago no reflejado', date: '05/06/2026', tone: 'success' as const, status: 'Resuelta' },
  { id: 'INC-2026-0112', title: 'Corte de suministro', date: '29/05/2026', tone: 'success' as const, status: 'Resuelta' },
  { id: 'INC-2026-0099', title: 'Problema con contador', date: '20/05/2026', tone: 'neutral' as const, status: 'Cerrada' },
];

export default function SupportScreen() {
  const { data: notifications } = useNotifications();

  return (
    <Screen topInset>
      <Text style={styles.title}>Mis consultas</Text>
      <View style={styles.card}>
        <Text style={styles.section}>Centro de notificaciones</Text>
        {(notifications ?? []).slice(0, 3).map((notification) => (
          <View key={notification.id} style={styles.notification}>
            <Text style={styles.ticketTitle}>{notification.title}</Text>
            <Text style={styles.date}>{notification.body}</Text>
          </View>
        ))}
        {(notifications ?? []).length === 0 ? <Text style={styles.date}>No hay notificaciones nuevas.</Text> : null}
      </View>
      <AppButton title="+ Nueva consulta" onPress={() => router.push('/support/create-ticket')} />
      <View style={styles.list}>
        {tickets.map((ticket) => (
          <Pressable
            key={ticket.id}
            onPress={() => router.push({ pathname: '/support/[id]', params: { id: ticket.id } })}
            style={({ pressed }) => [styles.ticket, pressed && styles.pressed]}>
            <View style={styles.ticketTop}>
              <Text style={styles.ticketId}>{ticket.id}</Text>
              <StatusBadge label={ticket.status} tone={ticket.tone} />
            </View>
            <Text style={styles.ticketTitle}>{ticket.title}</Text>
            <Text style={styles.date}>{ticket.date}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 32,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
    padding: 13,
  },
  section: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 13,
    fontWeight: '900',
  },
  notification: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 10,
  },
  ticket: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 7,
    padding: 13,
  },
  ticketTop: {
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
  ticketTitle: {
    ...fontBase,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  date: {
    ...fontBase,
    color: colors.muted,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.75,
  },
});
