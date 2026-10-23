import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';

import { useRevisarAlVolver } from '@/hooks/useRevisarAlVolver';
import { guardarPermisoBloqueado, leerPermisoBloqueado } from '@/lib/almacen';
import {
  mapearRespuesta,
  RECURSOS,
  type Recurso,
  type ResultadoPermiso,
} from '@/lib/permisos';

const INICIAL: ResultadoPermiso = {
  estado: 'cargando',
  parcial: false,
  detalle: null,
};

/**
 * Hook unificado de permisos.
 * Devuelve el estado normalizado, el matiz (aproximada / limitada),
 * y las funciones para pedir o abrir Ajustes.
 */
export function usePermiso(recurso: Recurso) {
  const [resultado, setResultado] = useState<ResultadoPermiso>(INICIAL);
  const activo = useRef(true);

  const refrescar = useCallback(async () => {
    try {
      const respuesta = await RECURSOS[recurso].consultar();
      const concedidoOSinDecidir =
        respuesta.granted || respuesta.status === 'undetermined';

      // Solo limpiamos el flag cuando el sistema confirma que está concedido
      // o que nunca se preguntó. Un denied "preguntable" no debe borrar un
      // bloqueo que se acaba de confirmar con un request.
      let bloqueadoLocal = false;
      if (concedidoOSinDecidir) {
        await guardarPermisoBloqueado(recurso, false);
      } else if (respuesta.canAskAgain === false) {
        bloqueadoLocal = await leerPermisoBloqueado(recurso);
      }

      if (activo.current) {
        setResultado(mapearRespuesta(recurso, respuesta, bloqueadoLocal));
      }
    } catch {
      if (activo.current) {
        setResultado({ estado: 'bloqueado', parcial: false, detalle: null });
      }
    }
  }, [recurso]);

  useEffect(() => {
    activo.current = true;
    setResultado(INICIAL);
    void refrescar();
    return () => {
      activo.current = false;
    };
  }, [refrescar]);

  useRevisarAlVolver(refrescar);

  const pedir = useCallback(async (): Promise<ResultadoPermiso | null> => {
    const config = RECURSOS[recurso];
    if (!config.pedir) return null;

    const respuesta = await config.pedir();
    // Un request real es la única fuente confiable para saber si quedó bloqueado.
    const bloqueado = !respuesta.granted && respuesta.canAskAgain === false;
    await guardarPermisoBloqueado(recurso, bloqueado);
    const nuevo = mapearRespuesta(recurso, respuesta, bloqueado);
    if (activo.current) {
      setResultado(nuevo);
    }
    return nuevo;
  }, [recurso]);

  const abrirAjustes = useCallback(() => {
    void Linking.openSettings();
  }, []);

  return {
    ...resultado,
    pedir,
    abrirAjustes,
    refrescar,
  };
}
