import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Opcion = {
  valor: string;
  etiqueta: string;
};

type Props = {
  opciones: readonly Opcion[];
  valor: string | null;
  onElegir: (valor: string) => void;
};

/** Chips seleccionables (categoría, sector, etc.). */
export function Selector({ opciones, valor, onElegir }: Props) {
  const tema = useTheme();

  return (
    <View style={styles.contenedor}>
      {opciones.map((opcion) => {
        const elegido = opcion.valor === valor;
        return (
          <Pressable
            key={opcion.valor}
            accessibilityRole="button"
            accessibilityState={{ selected: elegido }}
            onPress={() => onElegir(opcion.valor)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: elegido ? tema.backgroundSelected : tema.backgroundElement,
                borderColor: elegido ? tema.primary : tema.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <ThemedText
              type="small"
              themeColor={elegido ? 'primary' : 'text'}
              style={elegido ? styles.elegido : undefined}>
              {opcion.etiqueta}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  elegido: {
    fontWeight: '700',
  },
});
