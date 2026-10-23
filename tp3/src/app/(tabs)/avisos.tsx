import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { EstadoVacio } from '@/components/estado-vacio';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useReportes } from '@/lib/reportes';
import { formatearFecha } from '@/lib/tipos';

export default function AvisosScreen() {
  const router = useRouter();
  const tema = useTheme();
  const { avisos, noLeidos, marcarAvisosLeidos } = useReportes();

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <View style={styles.titulos}>
          <ThemedText type="smallBold" style={styles.titulo}>
            Bandeja de avisos
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {avisos.length === 0
              ? 'Sin novedades por ahora'
              : noLeidos > 0
                ? `${noLeidos} sin leer`
                : 'Todo leído'}
          </ThemedText>
        </View>
        {noLeidos > 0 ? (
          <Boton titulo="Marcar leídos" variante="secundario" onPress={marcarAvisosLeidos} />
        ) : null}
      </View>

      {avisos.length === 0 ? (
        <EstadoVacio
          titulo="No hay avisos"
          mensaje="Acá van a aparecer las novedades de tus reportes, incluso si no diste permiso para notificaciones."
        />
      ) : (
        avisos.map((aviso) => (
          <Pressable
            key={aviso.id}
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/reporte/[id]', params: { id: aviso.reporteId } })
            }
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
            <Tarjeta>
              <View style={styles.fila}>
                <View
                  style={[
                    styles.punto,
                    { backgroundColor: aviso.leido ? tema.border : tema.primary },
                  ]}
                />
                <View style={styles.textos}>
                  <ThemedText style={styles.tituloAviso}>{aviso.titulo}</ThemedText>
                  <ThemedText type="small">{aviso.cuerpo}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatearFecha(aviso.fecha)}
                  </ThemedText>
                </View>
              </View>
            </Tarjeta>
          </Pressable>
        ))
      )}

      <ThemedText type="small" themeColor="textSecondary" style={styles.nota}>
        Esta bandeja es la alternativa a las notificaciones: siempre recibe el aviso, aunque el
        permiso esté denegado.
      </ThemedText>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titulos: {
    flex: 1,
    gap: Spacing.half,
  },
  titulo: {
    fontSize: 18,
  },
  fila: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: Radius.small,
    marginTop: 6,
  },
  textos: {
    flex: 1,
    gap: Spacing.half,
  },
  tituloAviso: {
    fontWeight: '700',
  },
  nota: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
