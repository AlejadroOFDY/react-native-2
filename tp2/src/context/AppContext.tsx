import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { platos, type Plato } from '@/data/platos';
import { Cola } from '@/estructuras/Cola';
import { Pila } from '@/estructuras/Pila';

export interface LineaCarrito {
  plato: Plato;
  cantidad: number;
  subtotal: number;
}

export interface ItemPedido {
  platoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  numero: number;
  items: ItemPedido[];
  total: number;
  nota: string;
}

interface Snapshot {
  carrito: LineaCarrito[];
  cantidadItems: number;
  total: number;
  pedidosEnEspera: Pedido[];
  atendidos: Pedido[];
  frenteCocina: Pedido | undefined;
}

interface AppContextValue extends Snapshot {
  usuario: string | null;
  conSesion: boolean;
  login: (usuario: string, clave: string) => boolean;
  logout: () => void;

  nota: string;
  setNota: (nota: string) => void;
  agregarAlCarrito: (platoId: number) => void;
  deshacerUltimo: () => void;
  confirmarPedido: () => number | null;

  pedidosAdelante: (numero: number) => number;
  atenderSiguiente: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const USUARIO_COCINA = 'cocina';
const CLAVE_COCINA = 'cocina123';

function lineasDesdePila(ids: number[]): LineaCarrito[] {
  const orden: number[] = [];
  const cantidades = new Map<number, number>();

  for (const id of ids) {
    if (!cantidades.has(id)) orden.push(id);
    cantidades.set(id, (cantidades.get(id) ?? 0) + 1);
  }

  const lineas: LineaCarrito[] = [];
  for (const id of orden) {
    const plato = platos.find((p) => p.id === id);
    if (!plato) continue;
    const cantidad = cantidades.get(id) ?? 0;
    lineas.push({ plato, cantidad, subtotal: plato.precio * cantidad });
  }
  return lineas;
}

class EstadoComedor {
  #pilaAcciones = new Pila<number>();
  #colaPedidos = new Cola<Pedido>();
  #pilaAtendidos = new Pila<Pedido>();
  #proximoTurno = 1;

  #oyentes = new Set<() => void>();
  #snapshot: Snapshot = this.#construirSnapshot();

  suscribir = (oyente: () => void): (() => void) => {
    this.#oyentes.add(oyente);
    return () => {
      this.#oyentes.delete(oyente);
    };
  };

  obtenerSnapshot = (): Snapshot => this.#snapshot;

  #construirSnapshot(): Snapshot {
    const carrito = lineasDesdePila(this.#pilaAcciones.aArray());
    return {
      carrito,
      cantidadItems: carrito.reduce((acumulado, linea) => acumulado + linea.cantidad, 0),
      total: carrito.reduce((acumulado, linea) => acumulado + linea.subtotal, 0),
      pedidosEnEspera: this.#colaPedidos.aArray(),
      atendidos: this.#pilaAtendidos.aArray().reverse(),
      frenteCocina: this.#colaPedidos.frente(),
    };
  }

  #notificar(): void {
    this.#snapshot = this.#construirSnapshot();
    this.#oyentes.forEach((oyente) => oyente());
  }

  agregarAlCarrito(platoId: number): void {
    this.#pilaAcciones.push(platoId);
    this.#notificar();
  }

  deshacerUltimo(): void {
    this.#pilaAcciones.pop();
    this.#notificar();
  }

  confirmarPedido(nota: string): number | null {
    const ids = this.#pilaAcciones.aArray();
    if (ids.length === 0) return null;

    const lineas = lineasDesdePila(ids);
    const items: ItemPedido[] = lineas.map((linea) => ({
      platoId: linea.plato.id,
      nombre: linea.plato.nombre,
      precio: linea.plato.precio,
      cantidad: linea.cantidad,
    }));
    const total = lineas.reduce((acumulado, linea) => acumulado + linea.subtotal, 0);

    const numero = this.#proximoTurno;
    this.#proximoTurno += 1;
    this.#colaPedidos.encolar({ numero, items, total, nota });

    while (!this.#pilaAcciones.vacia) {
      this.#pilaAcciones.pop();
    }
    this.#notificar();
    return numero;
  }

  pedidosAdelante(numero: number): number {
    return this.#colaPedidos.aArray().findIndex((pedido) => pedido.numero === numero);
  }

  atenderSiguiente(): void {
    const pedido = this.#colaPedidos.desencolar();
    if (!pedido) return;
    this.#pilaAtendidos.push(pedido);
    this.#notificar();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [estado] = useState(() => new EstadoComedor());
  const [usuario, setUsuario] = useState<string | null>(null);
  const [nota, setNota] = useState('');

  const snapshot = useSyncExternalStore(
    estado.suscribir,
    estado.obtenerSnapshot,
    estado.obtenerSnapshot,
  );

  const login = useCallback((usuarioIngresado: string, clave: string) => {
    if (usuarioIngresado === USUARIO_COCINA && clave === CLAVE_COCINA) {
      setUsuario(usuarioIngresado);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  const agregarAlCarrito = useCallback(
    (platoId: number) => {
      estado.agregarAlCarrito(platoId);
    },
    [estado],
  );

  const deshacerUltimo = useCallback(() => {
    estado.deshacerUltimo();
  }, [estado]);

  const confirmarPedido = useCallback((): number | null => {
    const numero = estado.confirmarPedido(nota);
    if (numero !== null) {
      setNota('');
    }
    return numero;
  }, [estado, nota]);

  const atenderSiguiente = useCallback(() => {
    estado.atenderSiguiente();
  }, [estado]);

  const value: AppContextValue = {
    ...snapshot,
    usuario,
    conSesion: usuario !== null,
    login,
    logout,
    nota,
    setNota,
    agregarAlCarrito,
    deshacerUltimo,
    confirmarPedido,
    pedidosAdelante: (numero: number) => estado.pedidosAdelante(numero),
    atenderSiguiente,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const contexto = useContext(AppContext);
  if (!contexto) {
    throw new Error('useApp debe usarse dentro de <AppProvider>');
  }
  return contexto;
}
