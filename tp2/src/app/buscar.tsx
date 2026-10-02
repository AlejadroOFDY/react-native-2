import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { CATEGORIAS, platos } from '@/data/platos';
import { useTheme } from '@/hooks/use-theme';

export default function BuscarScreen() {
  const params = useLocalSearchParams<{ q?: string; categoria?: string }>();
  const theme = useTheme();

  const q = typeof params.q === 'string' ? params.q : '';
  const categoria = typeof params.categoria === 'string' ? params.categoria : '';

  const termino = q.trim().toLowerCase();
  const resultados = platos.filter((plato) => {
    const coincideTexto = termino === '' || plato.nombre.toLowerCase().includes(termino);
    const coincideCategoria = categoria === '' || plato.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  return (
    <Pantalla>
      <Stack.Screen options={{ title: 'Buscar' }} />

      <TextInput
        value={q}
        onChangeText={(nuevo) => router.setParams({ q: nuevo })}
        placeholder="Buscar un plato..."
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      <View style={styles.chips}>
        <Chip
          etiqueta="Todas"
          activo={categoria === ''}
          onPress={() => router.setParams({ categoria: '' })}
        />
        {CATEGORIAS.map((opcion) => (
          <Chip
            key={opcion}
            etiqueta={opcion}
            activo={categoria === opcion}
            onPress={() => router.setParams({ categoria: opcion })}
          />
        ))}
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
      </ThemedText>

      {resultados.map((plato) => (
        <Link
          key={plato.id}
          href={{ pathname: '/menu/[id]', params: { id: String(plato.id) } }}
          asChild>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                type={pressed ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.fila}>
                <View style={styles.descripcion}>
                  <ThemedText>{plato.nombre}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {plato.categoria}
                  </ThemedText>
                </View>
                <ThemedText type="smallBold">${plato.precio}</ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>
      ))}
    </Pantalla>
  );
}

function Chip({
  etiqueta,
  activo,
  onPress,
}: {
  etiqueta: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <ThemedView type={activo ? 'backgroundSelected' : 'backgroundElement'} style={styles.chip}>
        <ThemedText type="small" themeColor={activo ? 'text' : 'textSecondary'}>
          {etiqueta}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
  descripcion: {
    flex: 1,
    gap: Spacing.half,
  },
});
