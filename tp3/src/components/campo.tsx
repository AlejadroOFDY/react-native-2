import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  etiqueta: string;
  ayuda?: string;
};

export function Campo({ etiqueta, ayuda, style, multiline, ...rest }: Props) {
  const tema = useTheme();

  return (
    <View style={styles.contenedor}>
      <ThemedText type="smallBold">{etiqueta}</ThemedText>
      <TextInput
        placeholderTextColor={tema.textSecondary}
        multiline={multiline}
        style={[
          styles.input,
          {
            color: tema.text,
            backgroundColor: tema.backgroundElement,
            borderColor: tema.border,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      {ayuda ? (
        <ThemedText type="small" themeColor="textSecondary">
          {ayuda}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.one,
  },
  input: {
    borderRadius: Radius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 48,
    fontSize: 16,
  },
  multiline: {
    minHeight: 110,
    paddingTop: Spacing.two,
  },
});
