import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { getPlato } from '@/data/platos';

export default function DetallePlatoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agregarAlCarrito } = useApp();

  const idNumero = Number(id);
  const plato = Number.isInteger(idNumero) ? getPlato(idNumero) : undefined;

  if (!plato) {
    return (
      <Pantalla>
        <Stack.Screen options={{ title: 'Plato no encontrado' }} />
        <ThemedText type="subtitle">No existe el plato</ThemedText>
        <ThemedText themeColor="textSecondary">
          El identificador «{id}» no corresponde a ningún plato del menú.
        </ThemedText>
        <Link href="/menu">
          <ThemedText type="linkPrimary">Volver al menú</ThemedText>
        </Link>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Stack.Screen options={{ title: plato.nombre }} />
      <ThemedView type="backgroundElement" style={styles.tarjeta}>
        <ThemedText type="smallBold" style={styles.categoria}>
          {plato.categoria.toUpperCase()}
        </ThemedText>
        <ThemedText type="subtitle">{plato.nombre}</ThemedText>
        <ThemedText themeColor="textSecondary">{plato.descripcion}</ThemedText>
        <ThemedText type="smallBold">${plato.precio}</ThemedText>
      </ThemedView>

      <Boton titulo="Agregar al carrito" variante="primario" onPress={() => agregarAlCarrito(plato.id)} />

      <View style={styles.enlaces}>
        <Link href="/carrito">
          <ThemedText type="linkPrimary">Ir al carrito</ThemedText>
        </Link>
        <Link href="/menu">
          <ThemedText type="link">Seguir mirando el menú</ThemedText>
        </Link>
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  categoria: {
    letterSpacing: 1,
  },
  enlaces: {
    gap: Spacing.two,
  },
});
