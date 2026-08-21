import type { Arbol, Lista } from "@/constants/arboles";
import { ARBOLES_15 } from "@/constants/arboles";

const K_ARBOLES = "tp1.arboles";
const K_LISTAS = "tp1.listas";

// Árboles con los que arranca el catálogo (los 4 por defecto).
const INICIALES: Arbol[] = [
  "ceibo",
  "jacaranda",
  "lapacho-rosado",
  "quebracho-colorado",
].map((id) => ARBOLES_15.find((a) => a.id === id)!);

export function cargarArboles(): Arbol[] {
  if (typeof window === "undefined") return INICIALES;
  try {
    const raw = window.localStorage.getItem(K_ARBOLES);
    return raw ? (JSON.parse(raw) as Arbol[]) : INICIALES;
  } catch {
    return INICIALES;
  }
}

export function guardarArboles(arboles: Arbol[]): void {
  try {
    window.localStorage.setItem(K_ARBOLES, JSON.stringify(arboles));
  } catch {
    window.alert("No se pudo guardar en el almacenamiento local.");
  }
}

export function cargarListas(): Lista[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(K_LISTAS);
    return raw ? (JSON.parse(raw) as Lista[]) : [];
  } catch {
    return [];
  }
}

export function guardarListas(listas: Lista[]): void {
  try {
    window.localStorage.setItem(K_LISTAS, JSON.stringify(listas));
  } catch {
    window.alert("No se pudo guardar en el almacenamiento local.");
  }
}

export const nuevoId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
