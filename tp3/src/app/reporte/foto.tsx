import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { useBorrador } from '@/lib/borrador';

type Modo = 'inicio' | 'camara' | 'previa';

export default function FotoScreen() {
  const router = useRouter();
  const tema = useTheme();
  const camara = usePermiso('camara');
  const { borrador, actualizar } = useBorrador();

  const camaraRef = useRef<CameraView>(null);
  const [modo, setModo] = useState<Modo>('inicio');
  const [capturada, setCapturada] = useState<string | null>(null);
  const [capturando, setCapturando] = useState(false);
  const [esperandoPermiso, setEsperandoPermiso] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Al volver de la pantalla previa o de Ajustes, releemos el permiso.
  useFocusEffect(
    useCallback(() => {
      void camara.refrescar();
    }, [camara.refrescar])
  );

  // Si volvimos de la pantalla previa con el permiso concedido, abrimos la cámara.
  useFocusEffect(
    useCallback(() => {
      if (!esperandoPermiso) return;
      if (camara.estado === 'concedido') {
        setEsperandoPermiso(false);
        setModo('camara');
      } else if (camara.estado === 'bloqueado') {
        setEsperandoPermiso(false);
      }
    }, [esperandoPermiso, camara.estado])
  );

  function sacarFoto() {
    setMensaje(null);
    if (camara.estado === 'concedido') {
      setModo('camara');
      return;
    }
    if (camara.estado === 'preguntable') {
      setEsperandoPermiso(true);
      router.push({
        pathname: '/permisos/[recurso]',
        params: { recurso: 'camara' },
      });
      return;
    }
    if (camara.estado === 'bloqueado') {
      setMensaje('La cámara está bloqueada. Podés habilitarla en Ajustes o elegir una foto de la galería.');
    }
  }

  async function capturar() {
    if (!camaraRef.current || capturando) return;
    setCapturando(true);
    setMensaje(null);
    try {
      const foto = await camaraRef.current.takePictureAsync({ quality: 0.6 });
      if (foto?.uri) {
        setCapturada(foto.uri);
        setModo('previa');
      } else {
        setMensaje('La cámara no devolvió una foto. Probá de nuevo.');
      }
    } catch {
      setMensaje('No se pudo sacar la foto. Probá de nuevo o elegí una de la galería.');
    } finally {
      setCapturando(false);
    }
  }

  async function elegirDeGaleria() {
    setMensaje(null);
    try {
      // Sin requestMediaLibraryPermissionsAsync: el selector del sistema no necesita permiso.
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.6,
      });

      if (!resultado.canceled) {
        actualizar({ fotoUri: resultado.assets[0].uri });
        router.back();
      }
    } catch {
      setMensaje('No se pudo abrir el selector de fotos. Probá de nuevo.');
    }
  }

  if (modo === 'camara') {
    return (
      <View style={styles.contenedorCamara}>
        <CameraView ref={camaraRef} style={StyleSheet.absoluteFill} facing="back" />
        <View style={styles.superposicion}>
          <View style={styles.ayudaCamara}>
            <ThemedText type="smallBold" style={styles.textoCamara}>
              Encuadrá el desperfecto y tocá Capturar
            </ThemedText>
            {mensaje ? (
              <ThemedText type="small" style={styles.errorCamara}>
                {mensaje}
              </ThemedText>
            ) : null}
          </View>
          <Boton
            titulo={capturando ? 'Guardando…' : 'Capturar'}
            onPress={capturar}
            disabled={capturando}
          />
          <Boton titulo="Cancelar" variante="secundario" onPress={() => setModo('inicio')} />
        </View>
      </View>
    );
  }

  if (modo === 'previa' && capturada) {
    return (
      <Pantalla>
        <ThemedText type="smallBold" style={styles.tituloSeccion}>
          Foto tomada
        </ThemedText>
        <Image source={{ uri: capturada }} style={styles.fotoGrande} />
        <Boton
          titulo="Usar esta foto"
          onPress={() => {
            actualizar({ fotoUri: capturada });
            router.back();
          }}
        />
        <Boton titulo="Sacar otra" variante="secundario" onPress={() => setModo('camara')} />
        <Boton
          titulo="Cancelar"
          variante="texto"
          onPress={() => {
            setCapturada(null);
            setModo('inicio');
          }}
        />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      {borrador.fotoUri ? (
        <View style={styles.previewActual}>
          <Image source={{ uri: borrador.fotoUri }} style={styles.fotoGrande} />
          <Boton
            titulo="Quitar foto"
            variante="peligro"
            onPress={() => actualizar({ fotoUri: null })}
          />
        </View>
      ) : (
        <Tarjeta>
          <ThemedText type="smallBold">Todavía no hay foto</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Podés sacar una foto en el momento o elegir una de la galería.
          </ThemedText>
        </Tarjeta>
      )}

      <Boton titulo="Sacar foto" onPress={sacarFoto} />
      <Boton titulo="Elegir de la galería" variante="secundario" onPress={elegirDeGaleria} />

      {mensaje ? (
        <ThemedText type="small" themeColor="danger">
          {mensaje}
        </ThemedText>
      ) : null}

      {camara.estado === 'bloqueado' ? (
        <Tarjeta style={{ backgroundColor: tema.dangerSoft, borderColor: tema.danger }}>
          <ThemedText type="smallBold" themeColor="danger">
            Cámara bloqueada
          </ThemedText>
          <ThemedText type="small" themeColor="danger">
            Ajustes &gt; Aplicaciones &gt; Mantenimiento IPF &gt; Permisos &gt; Cámara
          </ThemedText>
          <Boton titulo="Abrir Ajustes" variante="peligro" onPress={camara.abrirAjustes} />
        </Tarjeta>
      ) : null}

      <Tarjeta>
        <ThemedText type="smallBold">Elegir de la galería no pide permiso</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Usamos ImagePicker.launchImageLibraryAsync, que abre el selector del sistema. La app no
          declara READ_MEDIA_IMAGES ni accede al resto de tus fotos.
        </ThemedText>
      </Tarjeta>

      <Boton titulo="Volver al reporte" variante="texto" onPress={() => router.back()} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenedorCamara: {
    flex: 1,
    backgroundColor: '#000000',
  },
  superposicion: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: Spacing.two,
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  ayudaCamara: {
    backgroundColor: '#000000A0',
    borderRadius: Radius.medium,
    padding: Spacing.three,
    gap: Spacing.one,
    marginBottom: 'auto',
    marginTop: Spacing.five,
  },
  textoCamara: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorCamara: {
    color: '#FFB4AB',
    textAlign: 'center',
  },
  tituloSeccion: {
    fontSize: 18,
  },
  fotoGrande: {
    width: '100%',
    height: 260,
    borderRadius: Radius.medium,
    backgroundColor: '#00000010',
  },
  previewActual: {
    gap: Spacing.two,
  },
});
