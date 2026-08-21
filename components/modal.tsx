import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
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
          <Texto contorno={false} style={styles.titulo}>
            {titulo}
          </Texto>
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
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
});
