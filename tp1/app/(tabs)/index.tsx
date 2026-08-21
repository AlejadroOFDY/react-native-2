import Boton from "@/components/boton";
import Texto from "@/components/texto";
import { ImageBackground, Platform, StyleSheet, View } from "react-native";

// Vista 1: portada.
export default function Inicio() {
  return (
    <ImageBackground
      source={require("@/assets/Ceibo.jpg")}
      style={styles.fondo}
      resizeMode="cover"
    >
      <View style={styles.contenido}>
        <View style={styles.recuadro}>
          <Texto contorno style={styles.h1}>
            Especies Arbóreas Autóctonas de Argentina
          </Texto>
        </View>
        <View style={styles.recuadro}>
          <Texto contorno style={styles.parrafo}>
            {
              // ponytail: sin saltos \n el justify sí aplica en web (una línea con salto forzado no se justifica en CSS).
              "En este trabajo se hablará de las especies arbóreas de Argentina, como una forma de expresar la importancia de los mismos, así como también reflejar nuestro gusto por estos."
            }
          </Texto>
        </View>
        <Boton titulo="Ver catálogo" href="/catalogo" />
      </View>
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
  contenido: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 48,
  },
  h1: { fontSize: 44, fontWeight: "bold", textAlign: "center" },
  parrafo: { fontSize: 22, textAlign: "justify", lineHeight: 34 },
  recuadro: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000",
    padding: 16,
    alignSelf: "stretch",
  },
});
