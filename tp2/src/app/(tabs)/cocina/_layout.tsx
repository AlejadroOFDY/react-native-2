import { Drawer } from 'expo-router/drawer';

export default function CocinaLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Cocina' }} />
      <Drawer.Screen name="atendidos" options={{ title: 'Atendidos' }} />
    </Drawer>
  );
}
