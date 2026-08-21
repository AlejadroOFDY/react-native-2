import Boton from "@/components/boton";
import Texto from "@/components/texto";
import { ImageBackground, StyleSheet, View } from "react-native";

// Vista 1: portada.
export default function Inicio() {
  return (
    <ImageBackground
      source={require("@/assets/Ceibo.avif")}
      style={styles.fondo}
      resizeMode="cover"
    >
      <View style={styles.contenido}>
        <Texto contorno style={styles.h1}>
          Especies Arbóreas Autóctonas de Argentina
        </Texto>
        <Texto contorno style={styles.parrafo}>
          {
            "En este trabajo se hablará de las especies arbóreas de Argentina,\ncomo una forma de expresar la importancia de los mismos,\n\nasí como también reflejar nuestro gusto por estos."
          }
        </Texto>
        <Boton titulo="Ver catálogo" href="/catalogo" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, width: "100%" },
  contenido: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 48,
  },
  h1: { fontSize: 44, fontWeight: "bold", textAlign: "center" },
  parrafo: { fontSize: 22, textAlign: "center", lineHeight: 34 },
});
