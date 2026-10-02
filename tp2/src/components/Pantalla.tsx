import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface PantallaProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
}

export function Pantalla({ children, contentStyle, edges = ['bottom'] }: PantallaProps) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={edges} style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled">
          {children}
          <DondeEstoy />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
