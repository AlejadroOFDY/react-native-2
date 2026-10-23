import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { BadgeEstado } from '@/components/badge-estado';
import { Boton } from '@/components/boton';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { cancelarAvisosProgramados } from '@/lib/notificaciones';
import { rutaAjustes } from '@/lib/permisos';
import { useReportes } from '@/lib/reportes';

export default function AjustesAppScreen() {
  const router = useRouter();
  const tema = useTheme();
  const permiso = usePermiso('notificaciones');
  const { avisarAlResolver, setAvisarAlResolver, reportes, eliminarTodos } = useReportes();
  const [pendiente, setPendiente] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mensajeDatos, setMensajeDatos] = useState<string | null>(null);
  const esProvisional = permiso.parcial;

  // Releemos el permiso cada vez que la pantalla vuelve a primer plano.
  useFocusEffect(
    useCallback(() => {
      void permiso.refrescar();
    }, [permiso.refrescar])
  );

  // Si volvimos de la pantalla previa con el permiso concedido, activamos el interruptor.
  useFocusEffect(
    useCallback(() => {
      if (pendiente && permiso.estado === 'concedido') {
        setAvisarAlResolver(true);
        setPendiente(false);
      }
    }, [pendiente, permiso.estado, setAvisarAlResolver])
  );

  function alternar(valor: boolean) {
    setMensaje(null);

    if (!valor) {
      setAvisarAlResolver(false);
      return;
    }

    if (permiso.estado === 'concedido') {
      setAvisarAlResolver(true);
      return;
    }

    if (permiso.estado === 'bloqueado') {
      setMensaje(
        'Las notificaciones están bloqueadas. Podés habilitarlas en Ajustes; mientras tanto, los avisos quedan en la bandeja.'
      );
      return;
    }

    if (permiso.estado === 'cargando') return;

    setPendiente(true);
    router.push({
      pathname: '/permisos/[recurso]',
      params: { recurso: 'notificaciones' },
    });
  }

  function confirmarBorrarTodo() {
    const cantidad = reportes.length;
    if (cantidad === 0) return;

    Alert.alert(
      'Borrar todos los reportes',
      `Se ${cantidad === 1 ? 'va' : 'van'} a borrar ${cantidad} ${
        cantidad === 1 ? 'reporte' : 'reportes'
      } y todos los avisos guardados. Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await cancelarAvisosProgramados();
            const borrados = eliminarTodos();
            setMensajeDatos(
              `Se ${borrados === 1 ? 'borró' : 'borraron'} ${borrados} ${
                borrados === 1 ? 'reporte' : 'reportes'
              } y sus avisos.`
            );
          },
        },
      ]
    );
  }

  return (
    <Pantalla>
      <Tarjeta>
        <View style={styles.filaInterruptor}>
          <View style={styles.textos}>
            <ThemedText style={styles.titulo}>Avisarme cuando se resuelva mi reporte</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Al activarlo se pide el permiso de notificaciones. En Android creamos antes el canal
              &quot;reportes&quot;, si no el diálogo no aparece.
            </ThemedText>
          </View>
          <Switch
            value={avisarAlResolver}
            onValueChange={alternar}
            trackColor={{ false: tema.border, true: tema.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.filaEstado}>
          <ThemedText type="small" themeColor="textSecondary">
            Estado del permiso:
          </ThemedText>
          <BadgeEstado estado={esProvisional ? 'provisional' : permiso.estado} />
        </View>

        {permiso.detalle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {permiso.detalle}
          </ThemedText>
        ) : null}

        {esProvisional ? (
          <ThemedText type="small" themeColor="warning">
            En iOS quedaron como provisionales: llegan en silencio hasta que las pases a
            visibles en Ajustes.
          </ThemedText>
        ) : null}

        {permiso.estado === 'bloqueado' ? (
          <>
            <ThemedText type="small" themeColor="danger" style={styles.ruta}>
              {rutaAjustes('notificaciones')}
            </ThemedText>
            <Boton titulo="Abrir Ajustes" variante="peligro" onPress={permiso.abrirAjustes} />
          </>
        ) : null}
      </Tarjeta>

      {mensaje ? (
        <ThemedText type="small" themeColor="warning">
          {mensaje}
        </ThemedText>
      ) : null}

      <Tarjeta>
        <ThemedText type="smallBold">Cómo se prueba</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Abrí un reporte y tocá &quot;Simular resolución&quot;. Se agrega el aviso a la bandeja y,
          si el permiso está concedido, a los 10 segundos aparece la notificación local.
        </ThemedText>
      </Tarjeta>

      <Tarjeta>
        <ThemedText type="smallBold">Si decís que no</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          La app sigue funcionando: los avisos se pueden leer en la pestaña Avisos. No volvemos a
          mostrar el diálogo ni insistimos.
        </ThemedText>
      </Tarjeta>

      <Boton
        titulo="Ver bandeja de avisos"
        variante="secundario"
        onPress={() => router.push('/avisos')}
      />

      <Tarjeta>
        <ThemedText type="smallBold">Datos de prueba</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Borra todos los reportes y avisos guardados en este teléfono. No cambia los permisos del
          sistema ni la preferencia de avisos.
        </ThemedText>
        <Boton
          titulo={
            reportes.length === 0
              ? 'No hay reportes para borrar'
              : `Borrar todos los reportes (${reportes.length})`
          }
          variante="peligro"
          disabled={reportes.length === 0}
          onPress={confirmarBorrarTodo}
        />
        {mensajeDatos ? (
          <ThemedText type="small" themeColor="success">
            {mensajeDatos}
          </ThemedText>
        ) : null}
      </Tarjeta>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  filaInterruptor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  textos: {
    flex: 1,
    gap: Spacing.one,
  },
  titulo: {
    fontWeight: '700',
    fontSize: 16,
  },
  filaEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  ruta: {
    fontWeight: '700',
  },
});
