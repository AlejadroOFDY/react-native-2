import Boton from "@/components/boton";
import Caja from "@/components/modal";
import Texto from "@/components/texto";
import type { Arbol, Lista } from "@/constants/arboles";
import { ARBOL_GENERICO, IMAGENES_DEFECTO } from "@/constants/imagenes";
import {
  cargarArboles,
  cargarListas,
  guardarArboles,
  guardarListas,
  nuevoId,
} from "@/lib/storage";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Ficha de un árbol: imagen, subir imagen, nombre, taxonomía y descripción.
export default function FichaArbol() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [arbol, setArbol] = useState<Arbol | null>(null);
  const [listas, setListas] = useState<Lista[]>([]);
  const [modal, setModal] = useState(false);
  const [nombreNueva, setNombreNueva] = useState("");

  useEffect(() => {
    Promise.all([cargarArboles(), cargarListas()]).then(([a, l]) => {
      setArbol(a.find((x) => x.id === id) ?? null);
      setListas(l);
    });
  }, [id]);

  if (!arbol) {
    return (
      <View style={styles.fondo}>
        <Texto>Árbol no encontrado.</Texto>
      </View>
    );
  }

  const fuente: any = arbol.imagenPersonalizada
    ? { uri: arbol.imagenPersonalizada }
    : (IMAGENES_DEFECTO[arbol.id] ?? ARBOL_GENERICO);

  const subirImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: true,
    });
    const base64 = resultado.canceled ? null : resultado.assets[0]?.base64;
    if (!base64) return;
    const dataUri = `data:image/jpeg;base64,${base64}`;
    const actualizados = (await cargarArboles()).map((a) =>
      a.id === arbol.id ? { ...a, imagenPersonalizada: dataUri } : a,
    );
    await guardarArboles(actualizados);
    setArbol({ ...arbol, imagenPersonalizada: dataUri });
  };

  const agregarAFavoritos = async (listaId?: string) => {
    const actualizadas = listaId
      ? listas.map((l) =>
          l.id === listaId && !l.arboles.includes(arbol.id)
            ? { ...l, arboles: [...l.arboles, arbol.id] }
            : l,
        )
      : [
          ...listas,
          {
            id: nuevoId(),
            nombre: nombreNueva.trim() || "Mi lista",
            arboles: [arbol.id],
          },
        ];
    await guardarListas(actualizadas);
    setModal(false);
    setNombreNueva("");
    router.push("/favoritos");
  };

  return (
    <View style={styles.fondo}>
      <View style={[styles.volver, { top: insets.top + 8 }]}>
        <Boton titulo="Volver" onPress={() => router.push("/catalogo")} />
      </View>

      <ScrollView contentContainerStyle={styles.contenido}>
        <Image source={fuente} style={styles.imagen} resizeMode="cover" />
        <Boton
          titulo="Subir imagen"
          onPress={subirImagen}
          style={styles.botonChico}
        />

        <Texto contorno style={styles.nombre}>
          {arbol.nombre}
        </Texto>
        <Texto contorno style={styles.cientifico}>
          {arbol.cientifico}
        </Texto>

        <View style={styles.caja}>
          <Texto contorno style={styles.sub}>
            Taxonomía
          </Texto>
          {Object.entries(arbol.taxonomia).map(([k, v]) => (
            <Texto key={k} contorno={false} style={styles.fila}>
              {k}: {v}
            </Texto>
          ))}
        </View>

        <View style={styles.caja}>
          <Texto contorno style={styles.sub}>
            Descripción
          </Texto>
          <Texto contorno={false} style={styles.detalle}>
            {arbol.descripcionDetalle}
          </Texto>
        </View>
      </ScrollView>

      <View style={styles.pie}>
        <Boton titulo="Agregar a favoritos" onPress={() => setModal(true)} />
      </View>

      <Caja
        visible={modal}
        titulo="Agregar a favoritos"
        onCerrar={() => setModal(false)}
      >
        {listas.length === 0 ? (
          <Texto contorno={false}>
            Todavía no tenés listas. Creá una para guardar este árbol.
          </Texto>
        ) : (
          listas.map((l) => (
            <Boton
              key={l.id}
              titulo={`Agregar a «${l.nombre}»`}
              onPress={() => agregarAFavoritos(l.id)}
            />
          ))
        )}
        <TextInput
          style={styles.input}
          placeholder="Nombre de la lista nueva"
          value={nombreNueva}
          onChangeText={setNombreNueva}
        />
        <Boton
          titulo="Crear lista y agregar"
          onPress={() => agregarAFavoritos()}
        />
        <Boton
          titulo="Cancelar"
          onPress={() => setModal(false)}
          style={styles.botonGris}
        />
      </Caja>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: "#f1eee6" },
  volver: { position: "absolute", left: 16, zIndex: 10 },
  contenido: { alignItems: "center", padding: 20, gap: 12 },
  imagen: {
    width: 220,
    height: 220,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#000",
  },
  botonChico: { paddingHorizontal: 16, paddingVertical: 8 },
  nombre: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  cientifico: { fontSize: 20, fontStyle: "italic", textAlign: "center" },
  caja: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    padding: 14,
    gap: 6,
  },
  sub: { fontSize: 22, fontWeight: "bold" },
  fila: { fontSize: 17 },
  detalle: { fontSize: 17, lineHeight: 24 },
  pie: { alignItems: "flex-end", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "Times New Roman",
  },
  botonGris: { backgroundColor: "#8a8a8a" },
});
