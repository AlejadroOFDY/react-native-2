import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface BotonProps {
  titulo: string;
  onPress: () => void;
  deshabilitado?: boolean;
  cargando?: boolean;
  variante?: 'primario' | 'secundario';
  style?: StyleProp<ViewStyle>;
}

export function Boton({
  titulo,
  onPress,
  deshabilitado = false,
  cargando = false,
  variante = 'secundario',
  style,
}: BotonProps) {
  const bloqueado = deshabilitado || cargando;

  return (
    <Pressable onPress={onPress} disabled={bloqueado} style={style}>
      {({ pressed }) => (
        <ThemedView
          type={variante === 'secundario' && pressed ? 'backgroundSelected' : 'backgroundElement'}
          style={[
            styles.boton,
            variante === 'primario' && styles.primario,
            bloqueado && styles.bloqueado,
          ]}>
          {cargando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText
              type="smallBold"
              style={variante === 'primario' ? styles.textoPrimario : undefined}
              themeColor={bloqueado ? 'textSecondary' : 'text'}>
              {titulo}
            </ThemedText>
          )}
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: '#208AEF',
  },
  bloqueado: {
    opacity: 0.5,
  },
  textoPrimario: {
    color: '#ffffff',
  },
});
