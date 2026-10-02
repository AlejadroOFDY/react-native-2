import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { CATEGORIAS, platosPorCategoria } from '@/data/platos';

export default function MenuScreen() {
  return (
    <Pantalla>
      <ThemedText type="subtitle">Menú</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Tocá un plato para ver el detalle y agregarlo al carrito.
      </ThemedText>

      {CATEGORIAS.map((categoria) => (
        <View key={categoria} style={styles.seccion}>
          <View style={styles.encabezado}>
            <ThemedText type="smallBold" style={styles.categoria}>
              {categoria.toUpperCase()}
            </ThemedText>
            <Link
              href={{ pathname: '/categorias/[categoria]', params: { categoria } }}>
              <ThemedText type="linkPrimary">Abrir categoría</ThemedText>
            </Link>
          </View>

          {platosPorCategoria(categoria).map((plato) => (
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
        </View>
      ))}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  seccion: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoria: {
    letterSpacing: 1,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
});
