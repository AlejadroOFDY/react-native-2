import { Link, Stack } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const articulos = [
  { ruta: '/ayuda/horarios', titulo: 'Horarios del comedor' },
  { ruta: '/ayuda/pagos/efectivo', titulo: 'Pagar en efectivo' },
  { ruta: '/ayuda/pagos/tarjeta', titulo: 'Pagar con tarjeta' },
  { ruta: '/ayuda/retiro', titulo: 'Retiro de pedidos' },
] as const;

export default function AyudaScreen() {
  return (
    <Pantalla>
      <Stack.Screen options={{ title: 'Ayuda' }} />
      <ThemedText type="subtitle">Centro de ayuda</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Elegí un artículo. Las rutas de ayuda pueden tener cualquier profundidad.
      </ThemedText>

      {articulos.map((articulo) => (
        <Link key={articulo.ruta} href={articulo.ruta} asChild>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                type={pressed ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.fila}>
                <ThemedText>{articulo.titulo}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {articulo.ruta}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>
      ))}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.half,
  },
});
