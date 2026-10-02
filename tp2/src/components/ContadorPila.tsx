import { useNavigation } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function ContadorPila({ titulo }: { titulo?: string }) {
  const navigation = useNavigation();
  const cantidad = navigation.getState()?.routes.length ?? 0;

  return (
    <View style={styles.contenedor}>
      {titulo ? <ThemedText type="smallBold">{titulo}</ThemedText> : null}
      <ThemedText type="small" themeColor="textSecondary">
        {cantidad} {cantidad === 1 ? 'pantalla' : 'pantallas'} en la pila
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.half,
  },
});
