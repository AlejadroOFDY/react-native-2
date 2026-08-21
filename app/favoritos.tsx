import Boton from "@/components/boton";
import Caja from "@/components/modal";
import Texto from "@/components/texto";
import type { Lista } from "@/constants/arboles";
import { ARBOL_GENERICO, IMAGENES_DEFECTO } from "@/constants/imagenes";
import {
  cargarArboles,
  cargarListas,
  guardarListas,
  nuevoId,
} from "@/lib/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

// Vista 3: favoritos / listas.
export default function Favoritos() {
  const [listas, setListas] = useState<Lista[]>([]);
  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [abiertaId, setAbiertaId] = useState<string | null>(null);
  const [guardada, setGuardada] = useState(false);

  useEffect(() => {
    setListas(cargarListas());
  }, []);

  const arboles = cargarArboles();
  const abierta = listas.find((l) => l.id === abiertaId) ?? null;

  const crearLista = () => {
    const lista: Lista = {
      id: nuevoId(),
      nombre: nombre.trim() || "Mi lista",
      arboles: [],
    };
    const actualizadas = [...listas, lista];
    setListas(actualizadas);
    guardarListas(actualizadas);
    setModal(false);
    setNombre("");
    setAbiertaId(lista.id);
  };

  const quitar = (idArbol: string) => {
    if (!abierta) return;
    const actualizadas = listas.map((l) =>
      l.id === abierta.id
        ? { ...l, arboles: l.arboles.filter((x) => x !== idArbol) }
        : l,
    );
    setListas(actualizadas);
    guardarListas(actualizadas);
  };

  const guardarLista = () => {
    guardarListas(listas);
    setGuardada(true);
    setTimeout(() => setGuardada(false), 2000);
  };

  const imagen = (id: string) => IMAGENES_DEFECTO[id] ?? ARBOL_GENERICO;

  return (
    <ImageBackground
      source={require("@/assets/Lapacho-Rosado.webp")}
      style={styles.fondo}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        <Texto contorno style={styles.h1}>
          Favoritos
        </Texto>

        <View style={styles.caja}>
          {abierta ? (
            <>
              <Texto contorno style={styles.h2}>
                {abierta.nombre}
              </Texto>

              {abierta.arboles.length === 0 ? (
                <View style={styles.vacio}>
                  <Texto contorno={false}>
                    Esta lista está vacía. Elegí un árbol del catálogo y usá
                    «Agregar a favoritos».
                  </Texto>
                  <Boton titulo="Ir al catálogo" href="/catalogo" />
                </View>
              ) : (
                abierta.arboles.map((idArbol) => {
                  const a = arboles.find((x) => x.id === idArbol);
                  if (!a) return null;
                  return (
                    <View key={idArbol} style={styles.tarjeta}>
                      <Image
                        source={imagen(idArbol)}
                        style={styles.mini}
                        resizeMode="cover"
                      />
                      <Pressable
                        style={styles.tarjetaInfo}
                        onPress={() => router.push(`/arbol/${idArbol}`)}
                      >
                        <Texto contorno={false} style={styles.nombre}>
                          {a.nombre}
                        </Texto>
                      </Pressable>
                      <Pressable
                        style={styles.quitar}
                        onPress={() => quitar(idArbol)}
                        accessibilityLabel={`Quitar ${a.nombre}`}
                      >
                        <Texto contorno={false} style={styles.quitarX}>
                          ✕
                        </Texto>
                      </Pressable>
                    </View>
                  );
                })
              )}

              <View style={styles.filaBotones}>
                <Boton titulo="Agregar más" href="/catalogo" />
                <Boton titulo="Guardar lista" onPress={guardarLista} />
                <Boton
                  titulo="Volver"
                  onPress={() => setAbiertaId(null)}
                  style={styles.botonGris}
                />
              </View>
              {guardada && (
                <Texto contorno={false} style={styles.aviso}>
                  ✓ Lista guardada en el dispositivo
                </Texto>
              )}
            </>
          ) : (
            <>
              {listas.map((l) => (
                <Pressable
                  key={l.id}
                  style={styles.cajita}
                  onPress={() => setAbiertaId(l.id)}
                >
                  <Texto contorno style={styles.nombreLista}>
                    {l.nombre}
                  </Texto>
                  <View style={styles.punteada}>
                    <Texto contorno style={styles.mas}>
                      +
                    </Texto>
                  </View>
                </Pressable>
              ))}
              <Boton titulo="crear listas" onPress={() => setModal(true)} />
            </>
          )}
        </View>
      </ScrollView>

      <Caja
        visible={modal}
        titulo="Crear lista"
        onCerrar={() => setModal(false)}
      >
        <TextInput
          style={styles.input}
          placeholder="Nombre de la lista"
          value={nombre}
          onChangeText={setNombre}
        />
        <Boton titulo="Aceptar" onPress={crearLista} />
      </Caja>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, width: "100%" },
  contenido: { padding: 20, gap: 16 },
  h1: { fontSize: 40, fontWeight: "bold", textAlign: "center" },
  caja: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 18,
    gap: 16,
  },
  h2: { fontSize: 28, fontWeight: "bold" },
  cajita: { alignItems: "center", gap: 6 },
  nombreLista: { fontSize: 20, fontWeight: "bold" },
  punteada: {
    width: 110,
    height: 110,
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  mas: { fontSize: 64, fontWeight: "bold", lineHeight: 70 },
  vacio: { alignItems: "center", gap: 14, paddingVertical: 10 },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    gap: 10,
  },
  mini: { width: 48, height: 48, borderRadius: 24 },
  tarjetaInfo: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: "bold" },
  quitar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#c62828",
    alignItems: "center",
    justifyContent: "center",
  },
  quitarX: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  filaBotones: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  botonGris: { backgroundColor: "#8a8a8a" },
  aviso: { textAlign: "center", fontSize: 16, color: "#1b5e20" },
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
