import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';

const data = [
  { label: 'Dic', value: 38 },
  { label: 'Ene', value: 82 },
  { label: 'Feb', value: 80 },
  { label: 'Mar', value: 94 },
  { label: 'Abr', value: 110 },
  { label: 'May', value: 126 },
];

const ticks = ['600', '450', '300', '150', '0'];

export function UsageBars() {
  return (
    <View style={styles.container}>
      <Text style={styles.unit}>kWh</Text>
      <View style={styles.row}>
        <View style={styles.axis}>
          {ticks.map((tick) => (
            <Text key={tick} style={styles.tick}>{tick}</Text>
          ))}
        </View>
        <View style={styles.chart}>
          {data.map((item) => (
            <View key={item.label} style={styles.barWrap}>
              <View style={[styles.bar, { height: item.value }]} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
  },
  unit: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 13,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  axis: {
    height: 154,
    justifyContent: 'space-between',
    paddingBottom: 22,
    width: 28,
  },
  chart: {
    alignItems: 'flex-end',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 132,
    justifyContent: 'space-between',
  },
  barWrap: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#1686F7',
    borderRadius: 5,
    width: 9,
  },
  label: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
  },
  tick: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 12,
  },
});
