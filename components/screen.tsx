import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

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
    <View style={styles.safeArea}>
      <KeyboardAvoidingView behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        {scroll ? (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scroll}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </View>
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
    gap: 18,
    padding: 20,
  },
});
