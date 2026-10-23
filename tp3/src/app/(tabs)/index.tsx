import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BadgeEstado } from '@/components/badge-estado';
import { Boton } from '@/components/boton';
import { EstadoVacio } from '@/components/estado-vacio';
import { Pantalla } from '@/components/pantalla';
import { Fila, Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useReportes } from '@/lib/reportes';
import { ETIQUETA_CATEGORIA, formatearFecha } from '@/lib/tipos';

export default function ReportesScreen() {
  const router = useRouter();
  const tema = useTheme();
  const { reportes, cargando } = useReportes();

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <View style={styles.titulos}>
          <ThemedText type="smallBold" style={styles.titulo}>
            Reportes propios
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {cargando
              ? 'Cargando…'
              : reportes.length === 1
                ? '1 reporte cargado'
                : `${reportes.length} reportes cargados`}
          </ThemedText>
        </View>
        <Boton
          titulo="Nuevo reporte"
          onPress={() => router.push('/reporte/nuevo')}
          style={styles.botonNuevo}
        />
      </View>

      {cargando ? (
        <ThemedText type="small" themeColor="textSecondary">
          Leyendo los reportes guardados…
        </ThemedText>
      ) : reportes.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay reportes"
          mensaje="Cuando veas una luz quemada, una canilla que pierde o un proyector roto, cargá el primero con el botón Nuevo reporte.">
          <Boton titulo="Crear mi primer reporte" onPress={() => router.push('/reporte/nuevo')} />
        </EstadoVacio>
      ) : (
        reportes.map((reporte) => (
          <Pressable
            key={reporte.id}
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/reporte/[id]', params: { id: reporte.id } })
            }
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
            <Tarjeta>
              <Fila style={styles.filaSuperior}>
                <BadgeEstado estado={reporte.estado} />
                <ThemedText type="small" themeColor="textSecondary">
                  {formatearFecha(reporte.creadoEn)}
                </ThemedText>
              </Fila>

              <View style={styles.cuerpo}>
                {reporte.fotoUri ? (
                  <Image source={{ uri: reporte.fotoUri }} style={styles.miniatura} />
                ) : null}
                <View style={styles.textos}>
                  <ThemedText style={styles.nombreReporte}>{reporte.titulo}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {ETIQUETA_CATEGORIA[reporte.categoria]} · {reporte.aula}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                    {reporte.descripcion}
                  </ThemedText>
                </View>
              </View>
            </Tarjeta>
          </Pressable>
        ))
      )}

      {reportes.length > 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.pie}>
          Tocá un reporte para ver el detalle y simular su resolución.
        </ThemedText>
      ) : null}
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
  botonNuevo: {
    paddingHorizontal: Spacing.three,
  },
  filaSuperior: {
    justifyContent: 'space-between',
  },
  cuerpo: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  miniatura: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#00000010',
  },
  textos: {
    flex: 1,
    gap: Spacing.half,
  },
  nombreReporte: {
    fontWeight: '700',
    fontSize: 16,
  },
  pie: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
