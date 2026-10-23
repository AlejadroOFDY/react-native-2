import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { BadgeEstado } from '@/components/badge-estado';
import { Boton } from '@/components/boton';
import { Pantalla } from '@/components/pantalla';
import { Fila, Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { LISTA_RECURSOS, RECURSOS, type Recurso } from '@/lib/permisos';

const PLATAFORMA =
  Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web';

export default function PanelPermisosScreen() {
  // Cambiar la key de las filas fuerza una nueva consulta del estado.
  const [version, setVersion] = useState(0);

  return (
    <Pantalla>
      <ThemedText type="small" themeColor="textSecondary">
        Plataforma de prueba: {PLATAFORMA}. El estado se vuelve a consultar solo al volver de
        Ajustes o al tocar Actualizar.
      </ThemedText>

      {LISTA_RECURSOS.map((recurso) => (
        <FilaPermiso key={`${recurso}-${version}`} recurso={recurso} />
      ))}

      <Boton
        titulo="Actualizar estados"
        variante="secundario"
        onPress={() => setVersion((valor) => valor + 1)}
      />

      <ThemedText type="small" themeColor="textSecondary" style={styles.nota}>
        Ningún permiso denegado impide cargar un reporte: siempre hay un camino alternativo
        (código a mano, selector del sistema, sector manual o bandeja de avisos).
      </ThemedText>
    </Pantalla>
  );
}

function FilaPermiso({ recurso }: { recurso: Recurso }) {
  const router = useRouter();
  const tema = useTheme();
  const permiso = usePermiso(recurso);
  const config = RECURSOS[recurso];

  useFocusEffect(
    useCallback(() => {
      void permiso.refrescar();
    }, [permiso.refrescar])
  );

  const esNotificaciones = recurso === 'notificaciones';
  const esFotos = recurso === 'fotos';

  const detalle = esFotos
    ? permiso.detalle ?? 'No se pide: usás el selector del sistema'
    : permiso.detalle;

  return (
    <Tarjeta>
      <Fila style={styles.filaSuperior}>
        <ThemedText style={styles.nombre}>{config.titulo}</ThemedText>
        <BadgeEstado
          estado={
            esFotos && permiso.estado !== 'concedido' ? 'no_requerido' : permiso.estado
          }
        />
      </Fila>

      <ThemedText type="small" themeColor="textSecondary">
        {PLATAFORMA}
        {detalle ? ` · ${detalle}` : ''}
      </ThemedText>

      {permiso.parcial ? (
        <View style={[styles.avisoParcial, { backgroundColor: tema.warningSoft }]}>
          <ThemedText type="small" themeColor="warning">
            Acceso parcial. La app se adapta y no muestra datos exactos.
          </ThemedText>
        </View>
      ) : null}

      <ThemedText type="small" themeColor="textSecondary">
        {config.explicacion}
      </ThemedText>

      {esFotos ? (
        <ThemedText type="small" themeColor="textSecondary">
          La app no pide este permiso: el selector del sistema solo comparte la foto elegida.
        </ThemedText>
      ) : esNotificaciones ? (
        <Boton
          titulo="Configurar avisos"
          variante="secundario"
          onPress={() => router.push('/ajustes-app')}
        />
      ) : permiso.estado === 'bloqueado' ? (
        <Boton titulo="Abrir Ajustes" variante="peligro" onPress={permiso.abrirAjustes} />
      ) : (
        <Boton
          titulo={permiso.estado === 'concedido' ? 'Pedir de nuevo' : 'Pedir permiso'}
          variante="secundario"
          onPress={() =>
            router.push({
              pathname: '/permisos/[recurso]',
              params: { recurso },
            })
          }
        />
      )}
    </Tarjeta>
  );
}

const styles = StyleSheet.create({
  filaSuperior: {
    justifyContent: 'space-between',
  },
  nombre: {
    fontWeight: '700',
    fontSize: 16,
  },
  avisoParcial: {
    borderRadius: Radius.small,
    padding: Spacing.two,
  },
  nota: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
