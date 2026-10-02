import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

type NombreIcono = keyof typeof Ionicons.glyphMap;

interface TarjetaAccesoProps {
  href: Href;
  icono: NombreIcono;
  titulo: string;
  detalle: string;
}

function TarjetaAcceso({ href, icono, titulo, detalle }: TarjetaAccesoProps) {
  const theme = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable style={styles.pressable}>
        {({ pressed }) => (
          <ThemedView
            type={pressed ? 'backgroundSelected' : 'backgroundElement'}
            style={styles.tarjeta}>
            <Ionicons name={icono} size={28} color={theme.text} />
            <View style={styles.textos}>
              <ThemedText type="smallBold">{titulo}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {detalle}
              </ThemedText>
            </View>
          </ThemedView>
        )}
      </Pressable>
    </Link>
  );
}

export default function InicioScreen() {
  const { conSesion, frenteCocina } = useApp();

  const detalleCocina = !conSesion
    ? 'Requiere sesión'
    : frenteCocina
      ? `Atendiendo el turno #${String(frenteCocina.numero).padStart(3, '0')}`
      : 'Sin pedidos en espera';

  return (
    <Pantalla edges={['top', 'bottom']}>
      <ThemedText type="title">Comedor IPF</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Pedí tu comida desde el celular y la cocina la atiende por orden de llegada.
      </ThemedText>

      <View style={styles.grid}>
        <TarjetaAcceso
          href="/menu"
          icono="restaurant-outline"
          titulo="Menú"
          detalle="Platos por categoría"
        />
        <TarjetaAcceso
          href="/buscar"
          icono="search-outline"
          titulo="Buscar"
          detalle="Por texto y categoría"
        />
        <TarjetaAcceso
          href="/ayuda"
          icono="help-circle-outline"
          titulo="Ayuda"
          detalle="Artículos de ayuda"
        />
        <TarjetaAcceso
          href={conSesion ? '/cocina' : '/login'}
          icono="flame-outline"
          titulo="Cocina"
          detalle={detalleCocina}
        />
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  pressable: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  tarjeta: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    minHeight: 120,
  },
  textos: {
    gap: Spacing.half,
  },
});
