import Texto from "@/components/texto";
import { ARBOLES_15 } from "@/constants/arboles";
import { ARBOL_GENERICO } from "@/constants/imagenes";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// Vista 4: mock de backend que "responde" tras 3 segundos.
export default function MasArboles() {
  const [cargando, setCargando] = useState(true);

  // ponytail: simula la espera de un backend real con un setTimeout.
  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/Quebracho-Colorado.jpg")}
      style={styles.fondo}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        <Texto contorno style={styles.h1}>
          ¡Algunos Árboles más!
        </Texto>

        <View style={styles.caja}>
          {cargando ? (
            <Texto contorno style={styles.espera}>
              Espera mientras nuestro backend responde...
            </Texto>
          ) : (
            ARBOLES_15.map((a) => (
              <View key={a.id} style={styles.tarjeta}>
                <Image
                  source={ARBOL_GENERICO}
                  style={styles.img}
                  resizeMode="cover"
                />
                <View style={styles.info}>
                  <Texto contorno style={styles.nombre}>
                    {a.nombre}
                  </Texto>
                  <Texto contorno={false} style={styles.desc}>
                    {a.descripcionDetalle}
                  </Texto>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  contenido: { padding: 20, gap: 16 },
  h1: { fontSize: 40, fontWeight: "bold", textAlign: "center" },
  caja: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  espera: { fontSize: 22, textAlign: "center", paddingVertical: 40 },
  tarjeta: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    gap: 12,
  },
  img: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, gap: 4 },
  nombre: { fontSize: 20, fontWeight: "bold" },
  desc: { fontSize: 15, lineHeight: 21 },
});
