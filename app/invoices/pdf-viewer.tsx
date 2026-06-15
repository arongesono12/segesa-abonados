import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { ScreenHeaderBar } from '@/components/navigation/ScreenHeaderBar';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

export default function InvoicePdfViewerScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId?: string }>();

  return (
    <Screen topInset>
      <ScreenHeaderBar title="Vista de factura (PDF)" rightIcon="share-variant" />

      <View style={styles.paper}>
        <SegesaLogo />
        <Text style={styles.pdfTitle}>FACTURA DE ELECTRICIDAD</Text>

        <View style={styles.infoBlock}>
          <PdfInfo label="Nombre:" value="Juan Mba" />
          <PdfInfo label="Contrato:" value="CN-003256" />
          <PdfInfo label="Direccion:" value="Malabo, Barrio Centro" />
          <PdfInfo label="Periodo:" value="01/05/2025 - 31/05/2025" />
          <PdfInfo label="Fecha de emision:" value="05/06/2025" />
          <PdfInfo label="Fecha limite de pago:" value="20/06/2025" />
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.concept]}>Concepto</Text>
            <Text style={styles.tableCell}>Consumo (kWh)</Text>
            <Text style={[styles.tableCell, styles.moneyCell]}>Importe (XAF)</Text>
          </View>
          <PdfTableRow concept="Cargo fijo" consumption="-" amount="5.000" />
          <PdfTableRow concept="Energia" consumption="500" amount="7.500" />
          <PdfTableRow concept="Impuestos" consumption="-" amount="2.500" />
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.total}>25.000 XAF</Text>
        </View>

        <Text style={styles.thanks}>Gracias por su confianza.{'\n'}Trabajamos para brindar un mejor servicio cada dia.</Text>
        {invoiceId ? <Text style={styles.hiddenId}>{invoiceId}</Text> : null}
      </View>

      <View style={styles.viewerBar}>
        <Text style={styles.viewerText}>1  /  1</Text>
        <View style={styles.zoomGroup}>
          <Text style={styles.viewerIcon}>-</Text>
          <View style={styles.zoomDivider} />
          <Text style={styles.viewerIcon}>+</Text>
        </View>
        <PlatformIcon name="share-outline" color={colors.text} size={28} />
      </View>
    </Screen>
  );
}

function PdfInfo({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function PdfTableRow({ concept, consumption, amount }: { concept: string; consumption: string; amount: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.concept]}>{concept}</Text>
      <Text style={styles.tableCell}>{consumption}</Text>
      <Text style={[styles.tableCell, styles.moneyCell]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 24,
    marginTop: 22,
    padding: 28,
    ...nativeUI.cardShadow,
  },
  pdfTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 26,
    textAlign: 'center',
  },
  infoBlock: {
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 18,
  },
  infoLabel: {
    ...fontBase,
    color: colors.text,
    fontSize: 20,
  },
  infoValue: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    fontSize: 20,
  },
  table: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  tableHeader: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  tableCell: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  concept: {
    textAlign: 'left',
  },
  moneyCell: {
    textAlign: 'right',
  },
  totalBox: {
    alignItems: 'center',
    backgroundColor: '#F1F3F6',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 74,
    paddingHorizontal: 22,
  },
  totalLabel: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 24,
    fontWeight: '900',
  },
  total: {
    ...fontBase,
    color: colors.success,
    fontSize: 26,
    fontWeight: '900',
  },
  thanks: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 16,
    textAlign: 'center',
  },
  hiddenId: {
    display: 'none',
  },
  viewerBar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    minHeight: 86,
    paddingHorizontal: 32,
  },
  viewerText: {
    ...fontBase,
    color: colors.text,
    fontSize: 24,
  },
  zoomGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  zoomDivider: {
    backgroundColor: colors.border,
    height: 32,
    width: 1,
  },
  viewerIcon: {
    ...fontBase,
    color: colors.text,
    fontSize: 34,
  },
});
