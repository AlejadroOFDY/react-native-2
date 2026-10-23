import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { UbicacionReporte } from '@/lib/tipos';

type Props = {
  ubicacion: UbicacionReporte | null;
  sector: string | null;
};

/**
 * Nunca muestra coordenadas si la ubicación es aproximada.
 */
export function ResumenUbicacion({ ubicacion, sector }: Props) {
  if (!ubicacion) {
    return (
      <View style={styles.bloque}>
        <ThemedText type="small" themeColor="textSecondary">
          Sin ubicación marcada.
        </ThemedText>
        {sector ? (
          <ThemedText type="small">Sector elegido a mano: {sector}</ThemedText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.bloque}>
      <ThemedText type="smallBold">
        {ubicacion.aproximada ? 'Ubicación aproximada' : 'Ubicación precisa'}
      </ThemedText>
      {ubicacion.aproximada ? (
        <ThemedText type="small" themeColor="textSecondary">
          El sistema dio permiso aproximado, así que no mostramos coordenadas exactas.
        </ThemedText>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          {ubicacion.latitud.toFixed(5)}, {ubicacion.longitud.toFixed(5)}
        </ThemedText>
      )}
      {sector ? (
        <ThemedText type="small" themeColor="textSecondary">
          Sector: {sector}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloque: {
    gap: Spacing.half,
  },
});
