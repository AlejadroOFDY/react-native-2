export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

export type EstadoReporte = 'pendiente' | 'en_curso' | 'resuelto';

export type UbicacionReporte = {
  latitud: number;
  longitud: number;
  /** true cuando Android dio accuracy "coarse" o iOS "reduced". */
  aproximada: boolean;
};

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  sector: string | null;
  estado: EstadoReporte;
  creadoEn: number;
  resueltoEn: number | null;
};

export type Aviso = {
  id: string;
  reporteId: string;
  titulo: string;
  cuerpo: string;
  fecha: number;
  leido: boolean;
};

export const CATEGORIAS: { valor: Categoria; etiqueta: string }[] = [
  { valor: 'electricidad', etiqueta: 'Electricidad' },
  { valor: 'agua', etiqueta: 'Agua' },
  { valor: 'mobiliario', etiqueta: 'Mobiliario' },
  { valor: 'equipos', etiqueta: 'Equipos' },
];

export const SECTORES = [
  'Patio',
  'Estacionamiento',
  'Pasillo',
  'Aula',
  'Baño',
  'Biblioteca',
] as const;

export const ETIQUETA_ESTADO: Record<EstadoReporte, string> = {
  pendiente: 'Pendiente',
  en_curso: 'En curso',
  resuelto: 'Resuelto',
};

export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  electricidad: 'Electricidad',
  agua: 'Agua',
  mobiliario: 'Mobiliario',
  equipos: 'Equipos',
};

export function formatearFecha(ts: number): string {
  const fecha = new Date(ts);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
}
