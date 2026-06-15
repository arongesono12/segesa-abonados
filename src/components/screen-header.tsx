import { StyleSheet, Text, View } from 'react-native';

import { sharedStyles } from '@/components/shared-styles';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={sharedStyles.title}>{title}</Text>
      {subtitle ? <Text style={sharedStyles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
