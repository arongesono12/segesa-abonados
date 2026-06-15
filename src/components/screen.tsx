import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { nativeUI, useNativeLayout } from '@/theme/native-ui';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  topInset?: boolean;
  constrainWidth?: boolean;
}>;

export function Screen({ children, scroll = true, topInset = false, constrainWidth = false }: ScreenProps) {
  const { maxContentWidth, isWide } = useNativeLayout();
  const edges = ['left', 'right', 'bottom'] as const;
  const content = (
    <View
      style={[
        styles.content,
        topInset && styles.flushTopContent,
        constrainWidth && { maxWidth: maxContentWidth },
        constrainWidth && isWide && styles.wideContent,
      ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        {scroll ? <ScrollView style={styles.scroller} contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
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
  scroller: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    gap: nativeUI.sectionGap,
    padding: nativeUI.screenPadding,
    paddingTop: Platform.select({ ios: 18, android: 16, web: 18, default: 16 }),
    width: '100%',
  },
  flushTopContent: {
    paddingTop: Platform.select({ ios: 12, android: 10, web: 12, default: 10 }),
  },
  wideContent: {
    alignSelf: 'center',
  },
});
