import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native';

import { BadgeEstado } from '@/components/badge-estado';
import { Boton } from '@/components/boton';
import { EstadoVacio } from '@/components/estado-vacio';
import { Pantalla } from '@/components/pantalla';
import { ResumenUbicacion } from '@/components/resumen-ubicacion';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { cancelarAvisosProgramados, programarAvisoResolucion } from '@/lib/notificaciones';
import { useReportes } from '@/lib/reportes';
import { ETIQUETA_CATEGORIA, formatearFecha } from '@/lib/tipos';

export default function DetalleReporteScreen() {
  const router = useRouter();
  const tema = useTheme();
  const parametros = useLocalSearchParams<{ id?: string }>();
  const id = parametros.id ?? '';
  const { obtenerReporte, resolverReporte, cargando, avisarAlResolver, eliminarReporte } =
    useReportes();
  const notificaciones = usePermiso('notificaciones');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [resolviendo, setResolviendo] = useState(false);

  const reporte = obtenerReporte(id);

  if (cargando) {
    return (
      <Pantalla scroll={false} style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.primary} />
        <ThemedText type="small" themeColor="textSecondary">
          Cargando el reporte…
        </ThemedText>
      </Pantalla>
    );
  }

  if (!reporte) {
    return (
      <Pantalla>
        <EstadoVacio
          titulo="Reporte no encontrado"
          mensaje="El identificador no existe o el reporte se borró. Volvé a la lista para elegir otro.">
          <Boton titulo="Ir a mis reportes" onPress={() => router.replace('/')} />
        </EstadoVacio>
      </Pantalla>
    );
  }

  const resuelto = reporte.estado === 'resuelto';

  async function simularResolucion(reporteId: string) {
    setResolviendo(true);
    setMensaje(null);
    const resultado = resolverReporte(reporteId);

    if (!resultado) {
      setResolviendo(false);
      return;
    }

    // El aviso en la bandeja se agrega siempre; la notificación es opcional.
    if (avisarAlResolver && notificaciones.estado === 'concedido') {
      try {
        await programarAvisoResolucion(resultado.reporte.titulo);
        setMensaje(
          'Reporte resuelto. Vas a recibir una notificación en 10 segundos y el aviso ya está en la bandeja.'
        );
      } catch {
        setMensaje('Reporte resuelto. El aviso quedó en la bandeja de Avisos.');
      }
    } else if (notificaciones.estado === 'concedido') {
      setMensaje(
        'Reporte resuelto. El aviso quedó en la bandeja porque el interruptor de avisos está apagado.'
      );
    } else {
      setMensaje(
        'Reporte resuelto. Como no hay permiso de notificaciones, el aviso quedó en la bandeja de Avisos.'
      );
    }

    setResolviendo(false);
  }

  function confirmarEliminar(reporteId: string, titulo: string) {
    Alert.alert(
      'Eliminar reporte',
      `Se va a borrar "${titulo}" y sus avisos. Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await cancelarAvisosProgramados();
            eliminarReporte(reporteId);
            router.replace('/');
          },
        },
      ]
    );
  }

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <BadgeEstado estado={reporte.estado} />
        <ThemedText type="small" themeColor="textSecondary">
          {formatearFecha(reporte.creadoEn)}
        </ThemedText>
      </View>

      <ThemedText type="subtitle" style={styles.titulo}>
        {reporte.titulo}
      </ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        {ETIQUETA_CATEGORIA[reporte.categoria]} · {reporte.aula}
      </ThemedText>

      <ThemedText>{reporte.descripcion}</ThemedText>

      {reporte.fotoUri ? (
        <Image source={{ uri: reporte.fotoUri }} style={styles.foto} />
      ) : (
        <Tarjeta>
          <ThemedText type="small" themeColor="textSecondary">
            Sin foto adjunta.
          </ThemedText>
        </Tarjeta>
      )}

      <Tarjeta>
        <ThemedText type="smallBold">Ubicación</ThemedText>
        <ResumenUbicacion ubicacion={reporte.ubicacion} sector={reporte.sector} />
      </Tarjeta>

      {resuelto ? (
        <Tarjeta>
          <ThemedText type="smallBold" themeColor="success">
            Resuelto
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {reporte.resueltoEn ? formatearFecha(reporte.resueltoEn) : 'Sin fecha de resolución.'}
          </ThemedText>
        </Tarjeta>
      ) : (
        <Boton
          titulo={resolviendo ? 'Simulando…' : 'Simular resolución'}
          onPress={() => simularResolucion(reporte.id)}
          disabled={resolviendo}
        />
      )}

      {mensaje ? (
        <View style={[styles.mensaje, { backgroundColor: tema.successSoft }]}>
          <ThemedText type="small" themeColor="success">
            {mensaje}
          </ThemedText>
        </View>
      ) : null}

      <Boton titulo="Ver bandeja de avisos" variante="secundario" onPress={() => router.push('/avisos')} />

      <Boton
        titulo="Eliminar reporte"
        variante="peligro"
        onPress={() => confirmarEliminar(reporte.id, reporte.titulo)}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  centrado: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 26,
    lineHeight: 32,
  },
  foto: {
    width: '100%',
    height: 220,
    borderRadius: Radius.medium,
    backgroundColor: '#00000010',
  },
  mensaje: {
    borderRadius: Radius.medium,
    padding: Spacing.three,
  },
});
