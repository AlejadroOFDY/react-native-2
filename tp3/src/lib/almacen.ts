import Storage from 'expo-sqlite/kv-store';

import type { Aviso, Reporte } from '@/lib/tipos';

const CLAVE = 'mantenimiento-ipf:v1';
const PREFIJO_BLOQUEO = 'permiso-bloqueado:';

export type EstadoGuardado = {
  reportes: Reporte[];
  avisos: Aviso[];
  avisarAlResolver: boolean;
};

export async function leerEstado(): Promise<EstadoGuardado | null> {
  try {
    const crudo = await Storage.getItem(CLAVE);
    if (!crudo) return null;
    const datos = JSON.parse(crudo) as Partial<EstadoGuardado>;
    return {
      reportes: Array.isArray(datos.reportes) ? datos.reportes : [],
      avisos: Array.isArray(datos.avisos) ? datos.avisos : [],
      avisarAlResolver: datos.avisarAlResolver === true,
    };
  } catch {
    return null;
  }
}

export async function guardarEstado(estado: EstadoGuardado): Promise<void> {
  try {
    await Storage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Si falla el guardado no queremos romper la app: la sesión sigue en memoria.
  }
}

/**
 * En Android, `canAskAgain: false` también aparece cuando venció un permiso
 * "Solo esta vez". Guardamos aparte un bloqueo confirmado por un request real
 * para no confundir ambos casos.
 */
export async function leerPermisoBloqueado(recurso: string): Promise<boolean> {
  try {
    return (await Storage.getItem(`${PREFIJO_BLOQUEO}${recurso}`)) === '1';
  } catch {
    return false;
  }
}

export async function guardarPermisoBloqueado(
  recurso: string,
  bloqueado: boolean
): Promise<void> {
  try {
    await Storage.setItem(`${PREFIJO_BLOQUEO}${recurso}`, bloqueado ? '1' : '0');
  } catch {
    // Sin persistencia, el estado de la sesión sigue siendo válido.
  }
}
