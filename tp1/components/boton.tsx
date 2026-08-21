import { router } from "expo-router";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

type Props = {
  titulo: string;
  onPress?: () => void;
  href?: string;
  style?: ViewStyle;
};

// Botón único de la app: verde, redondeado, letras blancas h3 y borde negro.
export default function Boton({ titulo, onPress, href, style }: Props) {
  const presionar = () => {
    if (onPress) onPress();
    else if (href) router.push(href);
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={presionar}
      style={({ pressed }) => [
        styles.boton,
        style,
        pressed && styles.presionado,
      ]}
    >
      <Text style={styles.texto}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: "#2e7d32",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#000",
    paddingHorizontal: 22,
    paddingVertical: 10,
    alignSelf: "center",
  },
  presionado: { opacity: 0.85 },
  texto: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    fontFamily: "Times New Roman",
  },
});
