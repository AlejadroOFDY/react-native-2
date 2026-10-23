import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Ejecuta `revisar` cuando la app vuelve a primer plano.
 * Sirve para releer permisos después de volver de Ajustes.
 */
export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current !== 'active';
      if (estabaAfuera && nuevo === 'active') {
        revisar();
      }
      anterior.current = nuevo;
    });

    return () => sub.remove();
  }, [revisar]);
}
