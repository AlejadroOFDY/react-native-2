import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Pantalla } from '@/components/pantalla';
import { ResumenUbicacion } from '@/components/resumen-ubicacion';
import { Selector } from '@/components/selector';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { useBorrador } from '@/lib/borrador';
import { SECTORES } from '@/lib/tipos';

const OPCIONES_SECTOR = SECTORES.map((sector) => ({ valor: sector, etiqueta: sector }));

export default function UbicacionScreen() {
  const router = useRouter();
  const tema = useTheme();
  const permiso = usePermiso('ubicacion');
  const { borrador, actualizar } = useBorrador();

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Al volver de Ajustes o de la pantalla previa, releemos el permiso.
  useFocusEffect(
    useCallback(() => {
      void permiso.refrescar();
    }, [permiso.refrescar])
  );

  const obtener = useCallback(async () => {
    setCargando(true);
    setMensaje(null);
    try {
      // Solo primer plano: nunca pedimos ACCESS_BACKGROUND_LOCATION.
      const permisos = await Location.getForegroundPermissionsAsync();
      if (!permisos.granted) {
        setMensaje('Sin permiso de ubicación. Elegí el sector a mano para continuar.');
        return;
      }

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const aproximada =
        permisos.android?.accuracy === 'coarse' || permisos.ios?.accuracy === 'reduced';

      actualizar({
        ubicacion: {
          latitud: posicion.coords.latitude,
          longitud: posicion.coords.longitude,
          aproximada,
        },
      });
    } catch {
      setMensaje('No pudimos obtener la ubicación. Elegí el sector a mano.');
    } finally {
      setCargando(false);
    }
  }, [actualizar]);

  // Al volver de la pantalla previa con el permiso concedido, marcamos solos.
  useFocusEffect(
    useCallback(() => {
      if (permiso.estado === 'concedido' && !borrador.ubicacion) {
        void obtener();
      }
    }, [permiso.estado, borrador.ubicacion, obtener])
  );

  function marcarUbicacion() {
    setMensaje(null);
    if (permiso.estado === 'preguntable') {
      router.push({
        pathname: '/permisos/[recurso]',
        params: { recurso: 'ubicacion' },
      });
      return;
    }
    if (permiso.estado === 'bloqueado') {
      setMensaje('La ubicación está bloqueada. Podés habilitarla en Ajustes o usar el sector manual.');
      return;
    }
    if (permiso.estado === 'cargando') return;
    void obtener();
  }

  return (
    <Pantalla>
      <ThemedText type="small" themeColor="textSecondary">
        Solo pedimos ubicación mientras usás la app (primer plano). Si elegís ubicación aproximada,
        no mostramos coordenadas exactas.
      </ThemedText>

      <Tarjeta>
        <ThemedText type="smallBold">Ubicación actual</ThemedText>
        <ResumenUbicacion ubicacion={borrador.ubicacion} sector={borrador.sector} />

        {borrador.ubicacion ? (
          <Boton
            titulo="Quitar ubicación"
            variante="peligro"
            onPress={() => actualizar({ ubicacion: null })}
          />
        ) : null}
      </Tarjeta>

      <Boton
        titulo={
          cargando ? 'Obteniendo…' : borrador.ubicacion ? 'Volver a marcar' : 'Usar mi ubicación'
        }
        onPress={marcarUbicacion}
        disabled={cargando}
      />

      {mensaje ? (
        <ThemedText type="small" themeColor="danger">
          {mensaje}
        </ThemedText>
      ) : null}

      {permiso.estado === 'bloqueado' ? (
        <Tarjeta style={{ backgroundColor: tema.dangerSoft, borderColor: tema.danger }}>
          <ThemedText type="smallBold" themeColor="danger">
            Ubicación bloqueada
          </ThemedText>
          <ThemedText type="small" themeColor="danger">
            Ajustes &gt; Aplicaciones &gt; Mantenimiento IPF &gt; Permisos &gt; Ubicación
          </ThemedText>
          <Boton titulo="Abrir Ajustes" variante="peligro" onPress={permiso.abrirAjustes} />
        </Tarjeta>
      ) : null}

      <View style={styles.seccion}>
        <ThemedText type="smallBold">Sector dentro del edificio</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Es la alternativa si no querés dar la ubicación. Podés combinar sector y ubicación.
        </ThemedText>
        <Selector
          opciones={OPCIONES_SECTOR}
          valor={borrador.sector}
          onElegir={(sector) => actualizar({ sector })}
        />
      </View>

      <Boton titulo="Listo" onPress={() => router.back()} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  seccion: {
    gap: Spacing.two,
  },
});
