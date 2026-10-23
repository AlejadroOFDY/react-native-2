import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const CANAL_REPORTES = 'reportes';

/**
 * Muestra las notificaciones aunque la app esté en primer plano.
 * Se registra una sola vez en el layout raíz.
 */
export function configurarHandlerNotificaciones(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * En Android 13+ el diálogo de notificaciones no aparece hasta que existe
 * al menos un canal. Hay que crearlo antes de pedir el permiso.
 */
export async function crearCanalReportes(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_REPORTES, {
    name: 'Reportes',
    description: 'Avisos cuando se resuelve un reporte',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#208AEF',
  });
}

/** Notificación local de prueba: se dispara 10 segundos después. */
export async function programarAvisoResolucion(titulo: string): Promise<string> {
  await crearCanalReportes();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reporte resuelto',
      body: `Se resolvió el reporte: ${titulo}`,
      data: { url: '/avisos' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      channelId: CANAL_REPORTES,
    },
  });
}

/**
 * Cancela las notificaciones locales pendientes.
 * Se usa al borrar reportes para que no quede un aviso "fantasma" a los 10 s.
 */
export async function cancelarAvisosProgramados(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Si no hay notificaciones o el permiso no está, no hay nada que cancelar.
  }
}
