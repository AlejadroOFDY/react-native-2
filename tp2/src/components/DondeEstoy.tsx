import { useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export const DEBUG = true;

export function DondeEstoy() {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  if (!DEBUG) return null;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold">¿Dónde estoy?</ThemedText>
      <ThemedText type="code">pathname: {pathname}</ThemedText>
      <ThemedText type="code">segments: {JSON.stringify(segments)}</ThemedText>
      <ThemedText type="code">params: {JSON.stringify(params)}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.four,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
});
