import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Campo } from '@/components/campo';
import { Pantalla } from '@/components/pantalla';
import { ResumenUbicacion } from '@/components/resumen-ubicacion';
import { Selector } from '@/components/selector';
import { ThemedText } from '@/components/themed-text';
import { Tarjeta } from '@/components/tarjeta';
import { Radius, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { useBorrador } from '@/lib/borrador';
import { useReportes } from '@/lib/reportes';
import { CATEGORIAS, type Categoria } from '@/lib/tipos';

export default function NuevoReporteScreen() {
  const router = useRouter();
  const { borrador, actualizar, reiniciar } = useBorrador();
  const { crearReporte } = useReportes();
  const camara = usePermiso('camara');
  const [error, setError] = useState<string | null>(null);

  // Al volver de Ajustes o de la pantalla previa, releemos el permiso.
  useFocusEffect(
    useCallback(() => {
      void camara.refrescar();
    }, [camara.refrescar])
  );

  function abrirEscaner() {
    if (camara.estado === 'concedido') {
      router.push('/reporte/escanear');
      return;
    }
    // Antes de cualquier diálogo del sistema se muestra la pantalla previa.
    router.push({
      pathname: '/permisos/[recurso]',
      params: {
        recurso: 'camara',
        destino: '/reporte/escanear',
      },
    });
  }

  function guardar() {
    if (!borrador.titulo.trim() || !borrador.descripcion.trim() || !borrador.aula.trim()) {
      setError('Completá el título, la descripción y el aula.');
      return;
    }

    const reporte = crearReporte({
      titulo: borrador.titulo,
      descripcion: borrador.descripcion,
      aula: borrador.aula,
      categoria: borrador.categoria,
      fotoUri: borrador.fotoUri,
      ubicacion: borrador.ubicacion,
      sector: borrador.sector,
    });

    reiniciar();
    router.replace({ pathname: '/reporte/[id]', params: { id: reporte.id } });
  }

  return (
    <Pantalla>
      <Campo
        etiqueta="Título"
        placeholder="Ej.: Luz quemada en el pasillo"
        value={borrador.titulo}
        onChangeText={(texto) => actualizar({ titulo: texto })}
        maxLength={80}
      />

      <Campo
        etiqueta="Descripción"
        placeholder="Contá qué pasa y desde cuándo."
        value={borrador.descripcion}
        onChangeText={(texto) => actualizar({ descripcion: texto })}
        multiline
      />

      <Campo
        etiqueta="Aula"
        placeholder="Ej.: Aula 12 o LAB-3"
        value={borrador.aula}
        onChangeText={(texto) => actualizar({ aula: texto })}
        autoCapitalize="characters"
        ayuda="Podés escribirlo a mano o leer el QR de la puerta."
      />

      <View style={styles.seccion}>
        <ThemedText type="smallBold">Categoría</ThemedText>
        <Selector
          opciones={CATEGORIAS}
          valor={borrador.categoria}
          onElegir={(valor) => actualizar({ categoria: valor as Categoria })}
        />
      </View>

      <Tarjeta>
        <ThemedText type="smallBold">Adjuntos</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Cada permiso se pide recién cuando tocás su botón.
        </ThemedText>

        <Boton titulo="Escanear QR del aula" variante="secundario" onPress={abrirEscaner} />
        <Boton
          titulo={borrador.fotoUri ? 'Cambiar foto' : 'Adjuntar foto'}
          variante="secundario"
          onPress={() => router.push('/reporte/foto')}
        />
        <Boton
          titulo={borrador.ubicacion ? 'Cambiar ubicación' : 'Marcar ubicación'}
          variante="secundario"
          onPress={() => router.push('/reporte/ubicacion')}
        />

        {borrador.fotoUri ? (
          <Image source={{ uri: borrador.fotoUri }} style={styles.foto} />
        ) : null}

        <ResumenUbicacion ubicacion={borrador.ubicacion} sector={borrador.sector} />
      </Tarjeta>

      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Boton titulo="Guardar reporte" onPress={guardar} />

      <ThemedText type="small" themeColor="textSecondary" style={styles.nota}>
        Ningún permiso es obligatorio: podés escribir el aula, elegir una foto de la galería y
        marcar el sector a mano.
      </ThemedText>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  seccion: {
    gap: Spacing.two,
  },
  foto: {
    width: '100%',
    height: 170,
    borderRadius: Radius.medium,
    backgroundColor: '#00000010',
  },
  nota: {
    textAlign: 'center',
  },
});
