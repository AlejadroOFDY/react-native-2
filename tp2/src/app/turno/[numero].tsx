import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function TurnoScreen() {
  const { numero } = useLocalSearchParams<{ numero: string }>();
  const { pedidosAdelante, atendidos } = useApp();

  const numeroNumero = Number(numero);
  const valido = Number.isInteger(numeroNumero) && numeroNumero > 0;
  const etiqueta = valido ? `#${String(numeroNumero).padStart(3, '0')}` : `«${numero}»`;
  const adelante = valido ? pedidosAdelante(numeroNumero) : -1;
  const atendido = valido && atendidos.some((pedido) => pedido.numero === numeroNumero);

  return (
    <Pantalla>
      <Stack.Screen options={{ title: `Turno ${etiqueta}` }} />

      <ThemedView type="backgroundSelected" style={styles.tarjeta}>
        <ThemedText type="smallBold">TU TURNO</ThemedText>
        <ThemedText type="title">{etiqueta}</ThemedText>
      </ThemedView>

      {!valido && (
        <ThemedText themeColor="textSecondary">
          El turno «{numero}» no es un número válido.
        </ThemedText>
      )}

      {valido && adelante >= 0 && (
        <ThemedText>
          Hay {adelante} {adelante === 1 ? 'pedido' : 'pedidos'} adelante.
        </ThemedText>
      )}

      {valido && adelante < 0 && atendido && (
        <ThemedText>Tu pedido ya fue atendido por la cocina.</ThemedText>
      )}

      {valido && adelante < 0 && !atendido && (
        <ThemedText themeColor="textSecondary">
          No encontramos ese turno en la cola de pedidos.
        </ThemedText>
      )}

      <Link href="/menu">
        <ThemedText type="linkPrimary">Pedir algo más</ThemedText>
      </Link>
      <Link href="/">
        <ThemedText type="link">Volver al inicio</ThemedText>
      </Link>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
});
