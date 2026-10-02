import { Stack } from 'expo-router';

import { ContadorPila } from '@/components/ContadorPila';

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTitle: (props) => <ContadorPila titulo={props.children} />,
      }}>
      <Stack.Screen name="index" options={{ title: 'Menú' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle del plato' }} />
    </Stack>
  );
}
