import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { BorradorProvider } from '@/lib/borrador';
import { configurarHandlerNotificaciones } from '@/lib/notificaciones';
import { ReportesProvider } from '@/lib/reportes';
import { useTheme } from '@/hooks/use-theme';

// Se registra una sola vez: permite ver la notificación con la app abierta.
configurarHandlerNotificaciones();

export default function RootLayout() {
  const scheme = useColorScheme();
  const tema = useTheme();

  const navegacion =
    scheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: tema.primary,
            background: tema.background,
            card: tema.backgroundElement,
            text: tema.text,
            border: tema.border,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: tema.primary,
            background: tema.background,
            card: tema.backgroundElement,
            text: tema.text,
            border: tema.border,
          },
        };

  return (
    <ThemeProvider value={navegacion}>
      <ReportesProvider>
        <BorradorProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: tema.background },
              headerStyle: { backgroundColor: tema.backgroundElement },
              headerTintColor: tema.text,
              headerTitleStyle: { fontWeight: '700' },
              headerShadowVisible: false,
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="reporte/nuevo" options={{ title: 'Nuevo reporte' }} />
            <Stack.Screen name="reporte/escanear" options={{ title: 'Escanear QR' }} />
            <Stack.Screen name="reporte/foto" options={{ title: 'Foto del desperfecto' }} />
            <Stack.Screen name="reporte/ubicacion" options={{ title: 'Ubicación' }} />
            <Stack.Screen name="reporte/[id]" options={{ title: 'Detalle del reporte' }} />
            <Stack.Screen name="ajustes-app" options={{ title: 'Avisos de la app' }} />
            <Stack.Screen
              name="permisos/[recurso]"
              options={{ title: 'Permiso', presentation: 'modal' }}
            />
          </Stack>
        </BorradorProvider>
      </ReportesProvider>
    </ThemeProvider>
  );
}
