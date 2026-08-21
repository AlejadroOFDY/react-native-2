import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Texto from "./texto";

type Props = {
  visible: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
};

// Ventana emergente reutilizable (agregar árbol, crear lista, favoritos).
export default function Caja({ visible, titulo, onCerrar, children }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <Pressable style={styles.fondo} onPress={onCerrar}>
        <Pressable style={styles.caja} onPress={(e) => e.stopPropagation()}>
          <View style={styles.encabezado}>
            <Texto contorno={false} style={styles.titulo}>
              {titulo}
            </Texto>
            <Pressable
              style={styles.cerrar}
              onPress={onCerrar}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            >
              <Text style={styles.cerrarX}>✕</Text>
            </Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  caja: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 420,
    gap: 12,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 4,
  },
  titulo: { fontSize: 22, fontWeight: "bold", flexShrink: 1 },
  cerrar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cerrarX: { fontSize: 16, fontWeight: "bold", color: "#000" },
});
