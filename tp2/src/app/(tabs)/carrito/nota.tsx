import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function NotaScreen() {
  const { nota, setNota } = useApp();
  const [texto, setTexto] = useState(nota);
  const router = useRouter();
  const theme = useTheme();

  return (
    <Pantalla>
      <ThemedText themeColor="textSecondary">
        Escribí una aclaración para la cocina (por ejemplo: «sin sal», «sin cebolla»).
      </ThemedText>

      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Ej.: sin sal"
        placeholderTextColor={theme.textSecondary}
        multiline
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      <Boton
        titulo="Guardar"
        variante="primario"
        onPress={() => {
          setNota(texto);
          router.back();
        }}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 96,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    textAlignVertical: 'top',
  },
});
