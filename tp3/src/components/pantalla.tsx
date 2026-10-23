import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Contenedor común de todas las pantallas. */
export function Pantalla({ children, scroll = true, style }: Props) {
  const insets = useSafeAreaInsets();
  const contenido = [
    styles.contenido,
    { paddingBottom: insets.bottom + Spacing.six },
    style,
  ];

  return (
    <ThemedView style={styles.container}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={contenido}>{children}</View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
});
