import { Link, Stack, usePathname } from 'expo-router';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';

export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <Pantalla>
      <Stack.Screen options={{ title: '404' }} />
      <ThemedText type="subtitle">Pantalla no encontrada</ThemedText>
      <ThemedText themeColor="textSecondary">
        La URL «{pathname}» no existe en esta aplicación.
      </ThemedText>
      <Link href="/">
        <ThemedText type="linkPrimary">Volver al inicio</ThemedText>
      </Link>
    </Pantalla>
  );
}
