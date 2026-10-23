import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Categoria, UbicacionReporte } from '@/lib/tipos';

export type Borrador = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  sector: string | null;
};

const BORRADOR_INICIAL: Borrador = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: 'electricidad',
  fotoUri: null,
  ubicacion: null,
  sector: null,
};

type ValorBorrador = {
  borrador: Borrador;
  actualizar: (parcial: Partial<Borrador>) => void;
  reiniciar: () => void;
};

const BorradorContext = createContext<ValorBorrador | null>(null);

/**
 * Mantiene los datos del reporte que se está cargando para que
 * las pantallas de escanear / foto / ubicación vuelvan sin perder nada.
 */
export function BorradorProvider({ children }: { children: ReactNode }) {
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_INICIAL);

  function actualizar(parcial: Partial<Borrador>) {
    setBorrador((prev) => ({ ...prev, ...parcial }));
  }

  function reiniciar() {
    setBorrador(BORRADOR_INICIAL);
  }

  return (
    <BorradorContext.Provider value={{ borrador, actualizar, reiniciar }}>
      {children}
    </BorradorContext.Provider>
  );
}

export function useBorrador(): ValorBorrador {
  const valor = useContext(BorradorContext);
  if (!valor) {
    throw new Error('useBorrador debe usarse dentro de <BorradorProvider>');
  }
  return valor;
}
