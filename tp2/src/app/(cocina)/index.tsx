import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

function etiquetaTurno(numero: number): string {
  return `#${String(numero).padStart(3, '0')}`;
}

export default function CocinaScreen() {
  const { frenteCocina, pedidosEnEspera, atenderSiguiente, logout } = useApp();
  const enEspera = pedidosEnEspera.length;

  return (
    <Pantalla>
      <ThemedText type="subtitle">Cocina</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {enEspera} {enEspera === 1 ? 'pedido en espera' : 'pedidos en espera'}.
      </ThemedText>

      {frenteCocina ? (
        <ThemedView type="backgroundElement" style={styles.tarjeta}>
          <ThemedText type="smallBold">
            PRÓXIMO — {etiquetaTurno(frenteCocina.numero)}
          </ThemedText>
          <View style={styles.items}>
            {frenteCocina.items.map((item) => (
              <ThemedText key={item.platoId}>
                {item.cantidad} × {item.nombre}
              </ThemedText>
            ))}
          </View>
          {frenteCocina.nota.trim().length > 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Nota: «{frenteCocina.nota}»
            </ThemedText>
          )}
          <ThemedText type="smallBold">Total: ${frenteCocina.total}</ThemedText>
        </ThemedView>
      ) : (
        <ThemedText themeColor="textSecondary">No hay pedidos en espera.</ThemedText>
      )}

      <Boton
        titulo="Atender siguiente"
        variante="primario"
        deshabilitado={!frenteCocina}
        onPress={atenderSiguiente}
      />

      <Link href="/cocina/atendidos">
        <ThemedText type="linkPrimary">Ver pedidos atendidos</ThemedText>
      </Link>

      <Boton titulo="Cerrar sesión de cocina" onPress={logout} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  items: {
    gap: Spacing.half,
  },
});
