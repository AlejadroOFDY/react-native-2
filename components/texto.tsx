import { StyleSheet, Text, type TextProps } from "react-native";

type Props = TextProps & { contorno?: boolean };

// Texto base: Times New Roman y, por defecto, contorno blanco para legibilidad.
// ponytail: react-native-web no reenvía className; usamos dataSet (sí reenviado)
// y la regla CSS [data-outline='true'] en global.css.
export default function Texto({ contorno = true, style, ...rest }: Props) {
  const props = contorno
    ? { ...rest, dataSet: { ...rest.dataSet, outline: "true" } }
    : rest;
  return <Text {...props} style={[styles.base, style]} />;
}

const styles = StyleSheet.create({
  base: { fontFamily: "Times New Roman", color: "#000", fontSize: 16 },
});
