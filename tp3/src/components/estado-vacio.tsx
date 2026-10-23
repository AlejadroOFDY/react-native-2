import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Props = {
  titulo: string;
  mensaje: string;
  children?: React.ReactNode;
};

export function EstadoVacio({ titulo, mensaje, children }: Props) {
  return (
    <View style={styles.contenedor}>
      <ThemedText type="smallBold" style={styles.titulo}>
        {titulo}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.mensaje}>
        {mensaje}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  titulo: {
    fontSize: 16,
    textAlign: 'center',
  },
  mensaje: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
