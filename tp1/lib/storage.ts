import AsyncStorage from "@react-native-async-storage/async-storage";
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

// ponytail: AsyncStorage funciona en mobile (Android/iOS) y en web con la misma API.
export async function cargarArboles(): Promise<Arbol[]> {
  try {
    const raw = await AsyncStorage.getItem(K_ARBOLES);
    return raw ? (JSON.parse(raw) as Arbol[]) : INICIALES;
  } catch {
    return INICIALES;
  }
}

export async function guardarArboles(arboles: Arbol[]): Promise<void> {
  try {
    await AsyncStorage.setItem(K_ARBOLES, JSON.stringify(arboles));
  } catch {
    // best-effort: no romper la app si el guardado falla.
  }
}

export async function cargarListas(): Promise<Lista[]> {
  try {
    const raw = await AsyncStorage.getItem(K_LISTAS);
    return raw ? (JSON.parse(raw) as Lista[]) : [];
  } catch {
    return [];
  }
}

export async function guardarListas(listas: Lista[]): Promise<void> {
  try {
    await AsyncStorage.setItem(K_LISTAS, JSON.stringify(listas));
  } catch {
    // best-effort.
  }
}

export const nuevoId = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
