import Boton from "@/components/boton";
import Caja from "@/components/modal";
import Texto from "@/components/texto";
import type { Arbol } from "@/constants/arboles";
import { cargarArboles, guardarArboles, nuevoId } from "@/lib/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
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
    setArboles(cargarArboles());
  }, []);

  const agregar = () => {
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
    guardarArboles(actualizados);
    setModal(false);
    setNombre("");
    setDescripcion("");
  };

  return (
    <ImageBackground
      source={require("@/assets/Jacarandá.webp")}
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
            <Pressable
              key={a.id}
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
  fondo: { flex: 1, width: "100%" },
  contenido: { flex: 1, padding: 20, gap: 16 },
  caja1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 14,
    padding: 14,
  },
  h2: { fontSize: 28, fontWeight: "bold" },
  caja2: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 14,
    padding: 14,
  },
  grilla: { gap: 14 },
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
