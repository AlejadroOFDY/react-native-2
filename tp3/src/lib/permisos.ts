import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { crearCanalReportes } from '@/lib/notificaciones';

export type Recurso = 'camara' | 'ubicacion' | 'notificaciones' | 'fotos';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type ResultadoPermiso = {
  estado: EstadoPermiso;
  /** Fotos limitadas o ubicación aproximada. */
  parcial: boolean;
  detalle: string | null;
};

/**
 * Forma común de todas las respuestas de permisos de Expo.
 * Los campos extra (accuracy, accessPrivileges, ios) son opcionales.
 */
export type RespuestaPermiso = {
  status: string;
  granted: boolean;
  canAskAgain?: boolean;
  accessPrivileges?: 'all' | 'limited' | 'none';
  android?: { accuracy?: 'fine' | 'coarse' | 'none'; importance?: number; interruptionFilter?: number };
  ios?: { accuracy?: 'full' | 'reduced' | 'none'; scope?: string; status?: number };
};

export type RecursoConfig = {
  titulo: string;
  /** Beneficio concreto, en el molde "Usamos tu [dato] para [beneficio]". */
  beneficio: string;
  explicacion: string;
  /** Camino aproximado en Ajustes, para la pantalla de bloqueado. */
  ajustes: string;
  consultar: () => Promise<RespuestaPermiso>;
  pedir: (() => Promise<RespuestaPermiso>) | null;
};

const MENSAJE_CAMARA =
  'Usamos tu cámara para leer el QR del aula y sacar la foto del desperfecto.';

export const RECURSOS: Record<Recurso, RecursoConfig> = {
  camara: {
    titulo: 'Cámara',
    beneficio: MENSAJE_CAMARA,
    explicacion:
      'La cámara se enciende solo cuando tocás "Escanear QR" o "Sacar foto". Si no la das, podés escribir el aula a mano y elegir una foto de la galería.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Cámara',
    consultar: () => Camera.getCameraPermissionsAsync(),
    pedir: () => Camera.requestCameraPermissionsAsync(),
  },
  ubicacion: {
    titulo: 'Ubicación',
    beneficio:
      'Usamos tu ubicación para marcar dónde está el desperfecto dentro del edificio.',
    explicacion:
      'Solo pedimos la ubicación mientras usás la app. No mostramos coordenadas exactas si elegís ubicación aproximada y nunca la compartimos con terceros.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Ubicación',
    consultar: () => Location.getForegroundPermissionsAsync(),
    pedir: () => Location.requestForegroundPermissionsAsync(),
  },
  notificaciones: {
    titulo: 'Notificaciones',
    beneficio:
      'Usamos las notificaciones para avisarte cuando se resuelve un reporte que hiciste.',
    explicacion:
      'El permiso se pide recién cuando activás el interruptor de avisos. Si no lo das, igual podés ver las novedades en la bandeja de Avisos.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Notificaciones',
    consultar: () => Notifications.getPermissionsAsync(),
    pedir: async () => {
      // Android 13+: el canal debe existir antes del diálogo del sistema.
      await crearCanalReportes();
      return Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
    },
  },
  fotos: {
    titulo: 'Fotos',
    beneficio:
      'Usamos tus fotos para adjuntar la imagen del desperfecto al reporte.',
    explicacion:
      'No pedimos permiso de galería: usás el selector del sistema y elegís solo la foto que querés adjuntar. La app nunca accede al resto de tus fotos.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Fotos',
    consultar: () => ImagePicker.getMediaLibraryPermissionsAsync(),
    pedir: null,
  },
};

export const LISTA_RECURSOS: Recurso[] = ['camara', 'ubicacion', 'notificaciones', 'fotos'];

export function esRecurso(valor: string): valor is Recurso {
  return valor === 'camara' || valor === 'ubicacion' || valor === 'notificaciones' || valor === 'fotos';
}

function calcularDetalle(
  recurso: Recurso,
  respuesta: RespuestaPermiso,
  bloqueadoLocal: boolean
): { parcial: boolean; detalle: string | null } {
  if (!respuesta.granted) {
    if (
      Platform.OS === 'android' &&
      respuesta.canAskAgain === false &&
      !bloqueadoLocal &&
      recurso !== 'fotos'
    ) {
      return {
        parcial: false,
        detalle: 'Permiso temporal vencido: se puede volver a pedir',
      };
    }
    return { parcial: false, detalle: null };
  }

  if (recurso === 'ubicacion') {
    const aproximada =
      respuesta.android?.accuracy === 'coarse' || respuesta.ios?.accuracy === 'reduced';
    return {
      parcial: aproximada,
      detalle: aproximada ? 'Ubicación aproximada' : 'Ubicación precisa',
    };
  }

  if (recurso === 'fotos') {
    if (respuesta.accessPrivileges === 'limited') {
      return { parcial: true, detalle: 'Acceso limitado a fotos' };
    }
    return { parcial: false, detalle: 'Acceso completo a fotos' };
  }

  if (recurso === 'notificaciones') {
    if (respuesta.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return { parcial: true, detalle: 'Notificaciones provisionales' };
    }
  }

  return { parcial: false, detalle: null };
}

/**
 * Traduce la respuesta de Expo a los cuatro estados que usa toda la app.
 *
 * En Android, `canAskAgain: false` no alcanza para afirmar que el permiso está
 * bloqueado: también es el valor que devuelve un permiso "Solo esta vez" que
 * venció. Por eso hace falta `bloqueadoLocal`, que se marca únicamente cuando
 * un request real devuelve denied sin posibilidad de volver a preguntar.
 */
export function mapearRespuesta(
  recurso: Recurso,
  respuesta: RespuestaPermiso,
  bloqueadoLocal = false
): ResultadoPermiso {
  const { parcial, detalle } = calcularDetalle(recurso, respuesta, bloqueadoLocal);
  const notificacionProvisional =
    recurso === 'notificaciones' &&
    respuesta.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  const sinDialogo = respuesta.canAskAgain === false;
  const bloqueoReal = sinDialogo && (Platform.OS !== 'android' || bloqueadoLocal);

  let estado: EstadoPermiso;
  if (respuesta.granted || notificacionProvisional) {
    estado = 'concedido';
  } else if (respuesta.status === 'undetermined' || !sinDialogo) {
    estado = 'preguntable';
  } else if (bloqueoReal) {
    estado = 'bloqueado';
  } else {
    estado = 'preguntable';
  }

  return { estado, parcial, detalle };
}
