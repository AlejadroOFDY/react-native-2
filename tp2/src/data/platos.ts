export type Categoria = 'desayuno' | 'almuerzo' | 'bebidas' | 'kiosco';

export interface Plato {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: Categoria;
}

export const CATEGORIAS: Categoria[] = ['desayuno', 'almuerzo', 'bebidas', 'kiosco'];

export const platos: Plato[] = [
  {
    id: 1,
    nombre: 'Mate cocido con medialunas',
    precio: 2500,
    descripcion: 'Dos medialunas de manteca y un mate cocido bien caliente.',
    categoria: 'desayuno',
  },
  {
    id: 2,
    nombre: 'Tostadas con queso y dulce',
    precio: 2800,
    descripcion: 'Pan casero tostado con queso fresco y dulce de batata.',
    categoria: 'desayuno',
  },
  {
    id: 3,
    nombre: 'Chipá',
    precio: 1200,
    descripcion: 'Chipá de almidón recién horneado.',
    categoria: 'desayuno',
  },
  {
    id: 4,
    nombre: 'Yogur con cereal',
    precio: 2200,
    descripcion: 'Yogur entero con granola y frutas de estación.',
    categoria: 'desayuno',
  },
  {
    id: 5,
    nombre: 'Milanesa con papas',
    precio: 6500,
    descripcion: 'Milanesa de carne con guarnición de papas fritas.',
    categoria: 'almuerzo',
  },
  {
    id: 6,
    nombre: 'Guiso de lentejas',
    precio: 5200,
    descripcion: 'Guiso abundante de lentejas con panceta y chorizo colorado.',
    categoria: 'almuerzo',
  },
  {
    id: 7,
    nombre: 'Empanadas de carne',
    precio: 1800,
    descripcion: 'Empanada criolla de carne cortada a cuchillo (por unidad).',
    categoria: 'almuerzo',
  },
  {
    id: 8,
    nombre: 'Ensalada César',
    precio: 4800,
    descripcion: 'Lechuga, pollo grillado, crutones y aderezo César.',
    categoria: 'almuerzo',
  },
  {
    id: 9,
    nombre: 'Agua mineral',
    precio: 1000,
    descripcion: 'Botella de agua sin gas de 500 ml.',
    categoria: 'bebidas',
  },
  {
    id: 10,
    nombre: 'Gaseosa',
    precio: 1500,
    descripcion: 'Vaso de gaseosa de 500 ml.',
    categoria: 'bebidas',
  },
  {
    id: 11,
    nombre: 'Café',
    precio: 1300,
    descripcion: 'Café de máquina en taza mediana.',
    categoria: 'bebidas',
  },
  {
    id: 12,
    nombre: 'Jugo de naranja exprimido',
    precio: 2000,
    descripcion: 'Jugo natural exprimido al momento de 400 ml.',
    categoria: 'bebidas',
  },
  {
    id: 13,
    nombre: 'Alfajor',
    precio: 900,
    descripcion: 'Alfajor de chocolate o dulce de leche.',
    categoria: 'kiosco',
  },
  {
    id: 14,
    nombre: 'Barrita de cereal',
    precio: 800,
    descripcion: 'Barrita de avena y frutos secos.',
    categoria: 'kiosco',
  },
  {
    id: 15,
    nombre: 'Turrón',
    precio: 700,
    descripcion: 'Turrón de maní clásico.',
    categoria: 'kiosco',
  },
  {
    id: 16,
    nombre: 'Chupetín',
    precio: 500,
    descripcion: 'Chupetín de fruta surtido.',
    categoria: 'kiosco',
  },
];

export function getPlato(id: number): Plato | undefined {
  return platos.find((p) => p.id === id);
}

export function esCategoria(valor: string): valor is Categoria {
  return (CATEGORIAS as string[]).includes(valor);
}

export function platosPorCategoria(categoria: Categoria): Plato[] {
  return platos.filter((p) => p.categoria === categoria);
}
