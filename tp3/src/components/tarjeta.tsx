import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Tarjeta con borde suave para agrupar contenido. */
export function Tarjeta({ style, children, ...rest }: ViewProps) {
  const tema = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.tarjeta, { borderColor: tema.border }, style]}
      {...rest}>
      {children}
    </ThemedView>
  );
}

export function Fila({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.fila, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    borderWidth: 1,
    borderRadius: Radius.large,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
});
