import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { esCategoria, platosPorCategoria } from '@/data/platos';

export default function CategoriaScreen() {
  const { categoria } = useLocalSearchParams<{ categoria: string }>();
  const nombre = typeof categoria === 'string' ? categoria : '';

  if (!esCategoria(nombre)) {
    return (
      <Pantalla>
        <Stack.Screen options={{ title: 'Categoría no encontrada' }} />
        <ThemedText type="subtitle">Categoría inexistente</ThemedText>
        <ThemedText themeColor="textSecondary">
          «{nombre}» no es una categoría válida. Probá con desayuno, almuerzo, bebidas o kiosco.
        </ThemedText>
        <Link href="/menu">
          <ThemedText type="linkPrimary">Volver al menú</ThemedText>
        </Link>
      </Pantalla>
    );
  }

  const platos = platosPorCategoria(nombre);

  return (
    <Pantalla>
      <Stack.Screen options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }} />
      <ThemedText type="subtitle">{nombre}</ThemedText>
      {platos.map((plato) => (
        <Link
          key={plato.id}
          href={{ pathname: '/menu/[id]', params: { id: String(plato.id) } }}
          asChild>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                type={pressed ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.fila}>
                <ThemedText>{plato.nombre}</ThemedText>
                <ThemedText type="smallBold">${plato.precio}</ThemedText>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
});
