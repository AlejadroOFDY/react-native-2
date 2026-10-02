import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function ConfirmarScreen() {
  const { carrito, total, nota, confirmarPedido } = useApp();
  const router = useRouter();

  if (carrito.length === 0) {
    return (
      <Pantalla>
        <Stack.Screen options={{ title: 'Confirmar pedido' }} />
        <ThemedText type="subtitle">No hay nada para confirmar</ThemedText>
        <ThemedText themeColor="textSecondary">Agregá platos al carrito primero.</ThemedText>
        <Link href="/menu">
          <ThemedText type="linkPrimary">Ir al menú</ThemedText>
        </Link>
      </Pantalla>
    );
  }

  const confirmar = () => {
    const numero = confirmarPedido();
    if (numero !== null) {
      router.replace({ pathname: '/turno/[numero]', params: { numero: String(numero) } });
    }
  };

  return (
    <Pantalla>
      <Stack.Screen options={{ title: 'Confirmar pedido' }} />
      <ThemedText type="subtitle">Resumen</ThemedText>

      <View style={styles.lista}>
        {carrito.map((linea) => (
          <ThemedView key={linea.plato.id} type="backgroundElement" style={styles.fila}>
            <ThemedText>
              {linea.cantidad} × {linea.plato.nombre}
            </ThemedText>
            <ThemedText type="smallBold">${linea.subtotal}</ThemedText>
          </ThemedView>
        ))}
      </View>

      {nota.trim().length > 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          Aclaración para la cocina: «{nota}»
        </ThemedText>
      )}

      <ThemedView type="backgroundSelected" style={styles.totalFila}>
        <ThemedText type="smallBold">Total</ThemedText>
        <ThemedText type="smallBold">${total}</ThemedText>
      </ThemedView>

      <Boton titulo="Confirmar" variante="primario" onPress={confirmar} />
      <ThemedText type="small" themeColor="textSecondary">
        Al confirmar se asigna un número de turno y el pedido se encola en la cocina.
      </ThemedText>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: {
    gap: Spacing.two,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
  totalFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
});
