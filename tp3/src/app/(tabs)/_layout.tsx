import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { useReportes } from '@/lib/reportes';

export default function TabsLayout() {
  const tema = useTheme();
  const { noLeidos } = useReportes();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: tema.backgroundElement },
        headerTintColor: tema.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: tema.background },
        tabBarActiveTintColor: tema.primary,
        tabBarInactiveTintColor: tema.textSecondary,
        tabBarStyle: {
          backgroundColor: tema.backgroundElement,
          borderTopColor: tema.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          headerTitle: 'Mantenimiento IPF',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'clipboard-text' : 'clipboard-text-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="exclamation-thick" size={size} color={color} />
          ),
          tabBarBadge: noLeidos > 0 ? noLeidos : undefined,
          tabBarBadgeStyle: { backgroundColor: tema.danger, color: '#FFFFFF' },
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Permisos',
          headerTitle: 'Panel de permisos',
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'alert' : 'alert-outline'}
              size={size}
              color={tema.danger}
            />
          ),
        }}
      />
    </Tabs>
  );
}
