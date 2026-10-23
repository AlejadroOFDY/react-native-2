import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BadgeEstado } from '@/components/badge-estado';
import { Boton } from '@/components/boton';
import { EstadoVacio } from '@/components/estado-vacio';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { esRecurso, RECURSOS, type Recurso } from '@/lib/permisos';

/**
 * Pantalla previa al diálogo del sistema.
 * Un único botón: "Continuar" (o "Abrir Ajustes" si ya está bloqueado).
 */
export default function PantallaPreviaPermiso() {
  const router = useRouter();
  const tema = useTheme();
  const parametros = useLocalSearchParams<{ recurso?: string; destino?: string }>();
  const recursoTexto = parametros.recurso ?? '';
  const destino = parametros.destino;
  const valido = esRecurso(recursoTexto);
  const recurso: Recurso = valido ? recursoTexto : 'camara';
  const config = RECURSOS[recurso];
  const permiso = usePermiso(recurso);

  const [pidiendo, setPidiendo] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  function salir() {
    if (destino) {
      router.replace(destino as Href);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  async function continuar() {
    if (permiso.estado === 'bloqueado') {
      permiso.abrirAjustes();
      return;
    }

    if (permiso.estado === 'concedido' || recurso === 'fotos') {
      salir();
      return;
    }

    setPidiendo(true);
    setMensaje(null);
    try {
      const nuevo = await permiso.pedir();
      if (!nuevo) {
        setMensaje('Este recurso no necesita pedir permiso.');
        return;
      }
      if (nuevo.estado === 'concedido') {
        salir();
      } else if (nuevo.estado === 'bloqueado') {
        setMensaje('El permiso quedó bloqueado. Podés habilitarlo desde Ajustes.');
      } else {
        setMensaje('No se otorgó el permiso. Podés seguir sin él o intentarlo de nuevo.');
      }
    } catch {
      setMensaje('No se pudo pedir el permiso. Probá de nuevo desde Ajustes.');
    } finally {
      setPidiendo(false);
    }
  }

  if (!valido) {
    return (
      <Pantalla>
        <EstadoVacio
          titulo="Recurso desconocido"
          mensaje="La pantalla previa solo existe para cámara, ubicación, notificaciones y fotos.">
          <Boton titulo="Volver" onPress={salir} />
        </EstadoVacio>
      </Pantalla>
    );
  }

  const tituloBoton =
    recurso === 'fotos'
      ? 'Entendido'
      : permiso.estado === 'bloqueado'
        ? 'Abrir Ajustes'
        : permiso.estado === 'concedido'
          ? destino
            ? 'Continuar'
            : 'Listo'
          : pidiendo
            ? 'Pidiendo…'
            : 'Continuar';

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <ThemedText type="subtitle" style={styles.titulo}>
          {config.titulo}
        </ThemedText>
        <BadgeEstado estado={permiso.estado} />
      </View>

      <Tarjeta>
        <ThemedText style={styles.beneficio}>{config.beneficio}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {config.explicacion}
        </ThemedText>
        {permiso.detalle ? (
          <ThemedText type="smallBold" themeColor="primary">
            {permiso.detalle}
          </ThemedText>
        ) : null}
      </Tarjeta>

      {permiso.estado === 'bloqueado' && recurso !== 'fotos' ? (
        <View style={[styles.bloqueado, { backgroundColor: tema.dangerSoft }]}>
          <ThemedText type="smallBold" themeColor="danger">
            El permiso está bloqueado
          </ThemedText>
          <ThemedText type="small" themeColor="danger">
            Habilitá {config.titulo.toLowerCase()} desde:
          </ThemedText>
          <ThemedText type="small" themeColor="danger" style={styles.ruta}>
            {config.ajustes}
          </ThemedText>
          <ThemedText type="small" themeColor="danger">
            Al volver, esta pantalla se actualiza sola.
          </ThemedText>
        </View>
      ) : null}

      {recurso === 'fotos' ? (
        <View style={[styles.bloqueado, { backgroundColor: tema.backgroundSelected }]}>
          <ThemedText type="small" themeColor="textSecondary">
            La app no declara READ_MEDIA_IMAGES ni pide acceso a la galería. El selector del
            sistema te deja elegir una foto sin dar permiso al resto del álbum.
          </ThemedText>
        </View>
      ) : null}

      {mensaje ? (
        <ThemedText type="small" themeColor="warning">
          {mensaje}
        </ThemedText>
      ) : null}

      <ThemedText type="small" themeColor="textSecondary">
        Podés cambiar esta decisión cuando quieras desde Ajustes del sistema.
      </ThemedText>

      <Boton
        titulo={tituloBoton}
        onPress={continuar}
        disabled={pidiendo || permiso.estado === 'cargando'}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  titulo: {
    fontSize: 26,
    lineHeight: 32,
  },
  beneficio: {
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 24,
  },
  bloqueado: {
    borderRadius: Radius.medium,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  ruta: {
    fontWeight: '700',
  },
});
