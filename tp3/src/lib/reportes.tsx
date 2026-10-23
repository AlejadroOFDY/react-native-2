import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { guardarEstado, leerEstado } from '@/lib/almacen';
import type { Aviso, Categoria, Reporte, UbicacionReporte } from '@/lib/tipos';

export type NuevoReporte = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  sector: string | null;
};

type ValorReportes = {
  reportes: Reporte[];
  avisos: Aviso[];
  cargando: boolean;
  avisarAlResolver: boolean;
  noLeidos: number;
  crearReporte: (datos: NuevoReporte) => Reporte;
  resolverReporte: (id: string) => { reporte: Reporte; aviso: Aviso } | null;
  eliminarReporte: (id: string) => void;
  eliminarTodos: () => number;
  marcarAvisosLeidos: () => void;
  setAvisarAlResolver: (valor: boolean) => void;
  obtenerReporte: (id: string) => Reporte | undefined;
};

const ReportesContext = createContext<ValorReportes | null>(null);

function nuevoId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ReportesProvider({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisarAlResolver, setAvisarAlResolver] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    leerEstado()
      .then((guardado) => {
        if (!activo) return;
        if (guardado) {
          setReportes(guardado.reportes);
          setAvisos(guardado.avisos);
          setAvisarAlResolver(guardado.avisarAlResolver);
        }
      })
      .catch(() => {
        // Sin datos guardados se arranca vacío.
      })
      .finally(() => {
        if (!activo) return;
        setHidratado(true);
        setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    void guardarEstado({ reportes, avisos, avisarAlResolver });
  }, [reportes, avisos, avisarAlResolver, hidratado]);

  function crearReporte(datos: NuevoReporte): Reporte {
    const reporte: Reporte = {
      id: nuevoId('r'),
      titulo: datos.titulo.trim(),
      descripcion: datos.descripcion.trim(),
      aula: datos.aula.trim(),
      categoria: datos.categoria,
      fotoUri: datos.fotoUri,
      ubicacion: datos.ubicacion,
      sector: datos.sector,
      estado: 'pendiente',
      creadoEn: Date.now(),
      resueltoEn: null,
    };
    setReportes((prev) => [reporte, ...prev]);
    return reporte;
  }

  function resolverReporte(id: string) {
    const actual = reportes.find((reporte) => reporte.id === id);
    if (!actual || actual.estado === 'resuelto') return null;

    const ahora = Date.now();
    const actualizado: Reporte = {
      ...actual,
      estado: 'resuelto',
      resueltoEn: ahora,
    };
    const aviso: Aviso = {
      id: nuevoId('a'),
      reporteId: id,
      titulo: 'Reporte resuelto',
      cuerpo: `Se resolvió "${actual.titulo}" (${actual.aula}).`,
      fecha: ahora,
      leido: false,
    };

    setReportes((prev) => prev.map((reporte) => (reporte.id === id ? actualizado : reporte)));
    setAvisos((prev) => [aviso, ...prev]);

    return { reporte: actualizado, aviso };
  }

  function marcarAvisosLeidos() {
    setAvisos((prev) => prev.map((aviso) => ({ ...aviso, leido: true })));
  }

  function eliminarReporte(id: string) {
    setReportes((prev) => prev.filter((reporte) => reporte.id !== id));
    setAvisos((prev) => prev.filter((aviso) => aviso.reporteId !== id));
  }

  function eliminarTodos() {
    const cantidad = reportes.length;
    setReportes([]);
    setAvisos([]);
    return cantidad;
  }

  function obtenerReporte(id: string) {
    return reportes.find((reporte) => reporte.id === id);
  }

  const noLeidos = avisos.filter((aviso) => !aviso.leido).length;

  return (
    <ReportesContext.Provider
      value={{
        reportes,
        avisos,
        cargando,
        avisarAlResolver,
        noLeidos,
        crearReporte,
        resolverReporte,
        eliminarReporte,
        eliminarTodos,
        marcarAvisosLeidos,
        setAvisarAlResolver,
        obtenerReporte,
      }}>
      {children}
    </ReportesContext.Provider>
  );
}

export function useReportes(): ValorReportes {
  const valor = useContext(ReportesContext);
  if (!valor) {
    throw new Error('useReportes debe usarse dentro de <ReportesProvider>');
  }
  return valor;
}
