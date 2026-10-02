import { StyleSheet, View } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

function etiquetaTurno(numero: number): string {
  return `#${String(numero).padStart(3, '0')}`;
}

export default function AtendidosScreen() {
  const { atendidos } = useApp();

  return (
    <Pantalla>
      <ThemedText type="subtitle">Atendidos</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Del más reciente al más antiguo.
      </ThemedText>

      {atendidos.length === 0 ? (
        <ThemedText themeColor="textSecondary">Todavía no se atendió ningún pedido.</ThemedText>
      ) : (
        atendidos.map((pedido) => (
          <ThemedView key={pedido.numero} type="backgroundElement" style={styles.tarjeta}>
            <ThemedText type="smallBold">{etiquetaTurno(pedido.numero)}</ThemedText>
            <View style={styles.items}>
              {pedido.items.map((item) => (
                <ThemedText key={item.platoId} type="small">
                  {item.cantidad} × {item.nombre}
                </ThemedText>
              ))}
            </View>
            <ThemedText type="smallBold">${pedido.total}</ThemedText>
          </ThemedView>
        ))
      )}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  items: {
    gap: Spacing.half,
  },
});
