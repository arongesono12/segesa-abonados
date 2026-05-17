import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { nativeUI, useNativeLayout } from '@/theme/native-ui';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  topInset?: boolean;
}>;

export function Screen({ children, scroll = true, topInset = false }: ScreenProps) {
  const { maxContentWidth, isWide } = useNativeLayout();
  const edges = topInset ? (['top', 'left', 'right', 'bottom'] as const) : (['left', 'right', 'bottom'] as const);
  const content = (
    <View style={[styles.content, { maxWidth: maxContentWidth }, isWide && styles.wideContent]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    gap: nativeUI.sectionGap,
    padding: nativeUI.screenPadding,
    width: '100%',
  },
  wideContent: {
    alignSelf: 'center',
  },
});
