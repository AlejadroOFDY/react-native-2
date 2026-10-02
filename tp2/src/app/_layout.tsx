import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider, useApp } from '@/context/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavegacionRaiz() {
  const { conSesion } = useApp();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="confirmar" options={{ presentation: 'modal', title: 'Confirmar pedido' }} />

      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Ingreso de cocina' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppProvider>
          <NavegacionRaiz />
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
