import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variante = 'primario' | 'secundario' | 'peligro' | 'texto';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Boton({ titulo, onPress, variante = 'primario', disabled, style }: Props) {
  const tema = useTheme();

  const colores: Record<Variante, { fondo: string; borde: string; texto: string }> = {
    primario: { fondo: tema.primary, borde: tema.primary, texto: '#FFFFFF' },
    secundario: { fondo: tema.backgroundElement, borde: tema.border, texto: tema.text },
    peligro: { fondo: tema.dangerSoft, borde: tema.danger, texto: tema.danger },
    texto: { fondo: 'transparent', borde: 'transparent', texto: tema.primary },
  };

  const elegido = colores[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.boton,
        {
          backgroundColor: elegido.fondo,
          borderColor: elegido.borde,
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        },
        style,
      ]}>
      <ThemedText style={[styles.texto, { color: elegido.texto }]}>{titulo}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: 48,
    borderRadius: Radius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  texto: {
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
});
