import { CameraView } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Campo } from '@/components/campo';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useTheme } from '@/hooks/use-theme';
import { useBorrador } from '@/lib/borrador';
import { rutaAjustes } from '@/lib/permisos';

export default function EscanearScreen() {
  const router = useRouter();
  const tema = useTheme();
  const camara = usePermiso('camara');
  const { actualizar } = useBorrador();

  const [escaneado, setEscaneado] = useState(false);
  const yaEscaneado = useRef(false);
  const [modoManual, setModoManual] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pidiendo, setPidiendo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void camara.refrescar();
    }, [camara.refrescar])
  );

  function guardarAula(valor: string) {
    const aula = valor.trim();
    if (!aula) {
      setError('Escribí el código o nombre del aula.');
      return;
    }
    actualizar({ aula });
    router.back();
  }

  async function pedirPermiso() {
    setPidiendo(true);
    setError(null);
    try {
      const nuevo = await camara.pedir();
      if (nuevo && nuevo.estado !== 'concedido') {
        setError(
          nuevo.estado === 'bloqueado'
            ? 'La cámara quedó bloqueada. Podés habilitarla en Ajustes o escribir el aula a mano.'
            : 'No se otorgó la cámara. Podés intentarlo otra vez o escribir el aula a mano.'
        );
      }
    } catch {
      setError('No se pudo abrir la cámara. Escribí el aula a mano.');
    } finally {
      setPidiendo(false);
    }
  }

  if (modoManual) {
    return (
      <Pantalla>
        <ThemedText type="subtitle" style={styles.titulo}>
          Escribir el aula a mano
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Es la alternativa cuando no querés dar la cámara. El texto se copia tal cual al campo
          Aula del reporte.
        </ThemedText>
        <Campo
          etiqueta="Código o nombre del aula"
          placeholder="Ej.: Aula 12"
          value={codigo}
          onChangeText={setCodigo}
          autoFocus
          autoCapitalize="characters"
          onSubmitEditing={() => guardarAula(codigo)}
        />
        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}
        <Boton titulo="Usar este código" onPress={() => guardarAula(codigo)} />
        <Boton titulo="Cancelar" variante="secundario" onPress={() => router.back()} />
      </Pantalla>
    );
  }

  if (camara.estado === 'cargando') {
    return (
      <Pantalla scroll={false} style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.primary} />
        <ThemedText type="small" themeColor="textSecondary">
          Consultando el permiso de cámara…
        </ThemedText>
      </Pantalla>
    );
  }

  if (camara.estado === 'concedido') {
    return (
      <View style={styles.contenedorCamara}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={
            escaneado
              ? undefined
              : ({ data }) => {
                  if (yaEscaneado.current) return;
                  yaEscaneado.current = true;
                  setEscaneado(true);
                  actualizar({ aula: data.trim() });
                  router.back();
                }
          }
          onMountError={(evento) => setError(evento.message)}
        />

        <View style={styles.superposicion}>
          <View style={styles.instruccion}>
            <ThemedText type="smallBold" style={styles.textoCamara}>
              Apuntá al QR pegado en la puerta del aula
            </ThemedText>
            {error ? (
              <ThemedText type="small" style={styles.errorCamara}>
                {error}
              </ThemedText>
            ) : null}
          </View>

          <Boton
            titulo="Escribir el aula a mano"
            variante="secundario"
            onPress={() => setModoManual(true)}
          />
        </View>
      </View>
    );
  }

  if (camara.estado === 'bloqueado') {
    return (
      <Pantalla>
        <ThemedText type="subtitle" style={styles.titulo}>
          La cámara está bloqueada
        </ThemedText>
        <Tarjeta style={{ backgroundColor: tema.dangerSoft, borderColor: tema.danger }}>
          <ThemedText type="smallBold" themeColor="danger">
            No vamos a insistir con el diálogo
          </ThemedText>
          <ThemedText type="small" themeColor="danger">
            Ya dijiste que no y el sistema no permite volver a preguntar desde la app.
          </ThemedText>
          <ThemedText type="small" themeColor="danger" style={styles.ruta}>
            {rutaAjustes('camara')}
          </ThemedText>
        </Tarjeta>

        <Boton titulo="Abrir Ajustes" onPress={camara.abrirAjustes} />
        <Boton
          titulo="Escribir el aula a mano"
          variante="secundario"
          onPress={() => setModoManual(true)}
        />
        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <ThemedText type="subtitle" style={styles.titulo}>
        Escanear el QR del aula
      </ThemedText>
      <Tarjeta>
        <ThemedText style={styles.beneficio}>
          Usamos tu cámara para leer el QR de la puerta y completar el aula.
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          La cámara se enciende solo en esta pantalla y no graba video ni audio.
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Si no la das, podés escribir el aula a mano.
        </ThemedText>
      </Tarjeta>

      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Boton
        titulo={pidiendo ? 'Pidiendo…' : 'Continuar'}
        onPress={pedirPermiso}
        disabled={pidiendo}
      />
      <Boton
        titulo="Escribir el aula a mano"
        variante="secundario"
        onPress={() => setModoManual(true)}
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
  titulo: {
    fontSize: 26,
    lineHeight: 32,
  },
  beneficio: {
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 24,
  },
  contenedorCamara: {
    flex: 1,
    backgroundColor: '#000000',
  },
  superposicion: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  instruccion: {
    backgroundColor: '#000000A0',
    borderRadius: Radius.medium,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  textoCamara: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorCamara: {
    color: '#FFB4AB',
    textAlign: 'center',
  },
  ruta: {
    fontWeight: '700',
  },
});
