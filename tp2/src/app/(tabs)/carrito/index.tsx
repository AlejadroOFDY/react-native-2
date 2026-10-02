import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function CarritoScreen() {
  const { carrito, total, cantidadItems, nota, deshacerUltimo } = useApp();
  const router = useRouter();

  if (carrito.length === 0) {
    return (
      <Pantalla>
        <ThemedText type="subtitle">Carrito vacío</ThemedText>
        <ThemedText themeColor="textSecondary">
          Todavía no agregaste platos. Pasá por el menú para armar tu pedido.
        </ThemedText>
        <Link href="/menu">
          <ThemedText type="linkPrimary">Ir al menú</ThemedText>
        </Link>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <ThemedText type="subtitle">Tu pedido</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {cantidadItems} {cantidadItems === 1 ? 'ítem' : 'ítems'}
      </ThemedText>

      <View style={styles.lista}>
        {carrito.map((linea) => (
          <ThemedView key={linea.plato.id} type="backgroundElement" style={styles.fila}>
            <View style={styles.descripcion}>
              <ThemedText>{linea.plato.nombre}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {linea.cantidad} × ${linea.plato.precio}
              </ThemedText>
            </View>
            <ThemedText type="smallBold">${linea.subtotal}</ThemedText>
          </ThemedView>
        ))}
      </View>

      <ThemedView type="backgroundSelected" style={styles.totalFila}>
        <ThemedText type="smallBold">Total</ThemedText>
        <ThemedText type="smallBold">${total}</ThemedText>
      </ThemedView>

      {nota.trim().length > 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          Aclaración: «{nota}»
        </ThemedText>
      )}

      <Boton titulo="Deshacer último" onPress={deshacerUltimo} />
      <Link href="/carrito/nota">
        <ThemedText type="linkPrimary">
          {nota.trim().length > 0 ? 'Editar aclaración' : 'Agregar aclaración para la cocina'}
        </ThemedText>
      </Link>
      <Boton titulo="Confirmar pedido" variante="primario" onPress={() => router.push('/confirmar')} />
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
  descripcion: {
    flex: 1,
    gap: Spacing.half,
  },
  totalFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
});
