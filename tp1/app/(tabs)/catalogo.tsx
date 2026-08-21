import Boton from "@/components/boton";
import Caja from "@/components/modal";
import Texto from "@/components/texto";
import type { Arbol } from "@/constants/arboles";
import { cargarArboles, guardarArboles, nuevoId } from "@/lib/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

// Vista 2: catálogo de árboles.
export default function Catalogo() {
  const [arboles, setArboles] = useState<Arbol[]>([]);
  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    cargarArboles().then(setArboles);
  }, []);

  const agregar = async () => {
    const nombreArbol = nombre.trim();
    if (!nombreArbol) return;
    const nuevo: Arbol = {
      id: nuevoId(),
      nombre: nombreArbol,
      cientifico: "—",
      descripcion: descripcion.trim() || "Sin descripción.",
      descripcionDetalle: descripcion.trim() || "Sin descripción.",
      taxonomia: {
        Reino: "—",
        División: "—",
        Clase: "—",
        Orden: "—",
        Familia: "—",
        Género: "—",
        Especie: "—",
      },
    };
    const actualizados = [...arboles, nuevo];
    setArboles(actualizados);
    await guardarArboles(actualizados);
    setModal(false);
    setNombre("");
    setDescripcion("");
  };

  const eliminarArbol = async (idArbol: string) => {
    const actualizados = arboles.filter((a) => a.id !== idArbol);
    setArboles(actualizados);
    await guardarArboles(actualizados);
  };

  return (
    <ImageBackground
      source={require("@/assets/Jacarandá.jpg")}
      style={styles.fondo}
      resizeMode="cover"
    >
      <View style={styles.contenido}>
        <View style={styles.caja1}>
          <Texto contorno style={styles.h2}>
            Árboles Actuales
          </Texto>
          <Boton titulo="Agregar Árbol" onPress={() => setModal(true)} />
        </View>

        <ScrollView style={styles.caja2} contentContainerStyle={styles.grilla}>
          {arboles.map((a) => (
            <View key={a.id} style={styles.tarjetaContenedor}>
              <Pressable
                style={styles.tarjeta}
                onPress={() => router.push(`/arbol/${a.id}`)}
              >
                <Texto contorno style={styles.nombre}>
                  {a.nombre}
                </Texto>
                <Texto contorno={false} style={styles.desc}>
                  {a.descripcion}
                </Texto>
              </Pressable>
              <Pressable
                style={styles.eliminar}
                onPress={() => eliminarArbol(a.id)}
                accessibilityLabel={`Eliminar ${a.nombre}`}
              >
                <Texto contorno={false} style={styles.eliminarX}>
                  ✕
                </Texto>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      <Caja
        visible={modal}
        titulo="Agregar Árbol"
        onCerrar={() => setModal(false)}
      >
        <TextInput
          style={styles.input}
          placeholder="Nombre del árbol"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />
        <Boton titulo="Aceptar" onPress={agregar} />
      </Caja>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // ponytail: en web sin height el <Image> interno toma el alto natural de la foto (se corta en blanco). Solo web; mobile intacto.
  fondo: {
    flex: 1,
    width: "100%",
    ...Platform.select({ web: { height: "100%" } }),
  },
  contenido: { flex: 1, padding: 20, gap: 16 },
  caja1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 10,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 14,
    padding: 14,
  },
  h2: { fontSize: 28, fontWeight: "bold", flexShrink: 1 },
  caja2: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 14,
    padding: 14,
  },
  grilla: { gap: 14 },
  tarjetaContenedor: { position: "relative" },
  eliminar: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#c62828",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  eliminarX: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  tarjeta: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    padding: 14,
  },
  nombre: { fontSize: 22, fontWeight: "bold" },
  desc: { fontSize: 16, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "Times New Roman",
  },
});
