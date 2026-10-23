import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { EstadoPermiso } from '@/lib/permisos';
import { ETIQUETA_ESTADO, type EstadoReporte } from '@/lib/tipos';

type Estado = EstadoReporte | EstadoPermiso | 'no_requerido';

const ETIQUETAS: Record<Estado, string> = {
  ...ETIQUETA_ESTADO,
  cargando: 'Consultando…',
  concedido: 'Concedido',
  preguntable: 'Preguntable',
  bloqueado: 'Bloqueado',
  no_requerido: 'No se pide',
};

const COLORES: Record<Estado, { texto: ThemeColor; fondo: ThemeColor }> = {
  pendiente: { texto: 'warning', fondo: 'warningSoft' },
  en_curso: { texto: 'primary', fondo: 'backgroundSelected' },
  resuelto: { texto: 'success', fondo: 'successSoft' },
  cargando: { texto: 'textSecondary', fondo: 'backgroundSelected' },
  concedido: { texto: 'success', fondo: 'successSoft' },
  preguntable: { texto: 'warning', fondo: 'warningSoft' },
  bloqueado: { texto: 'danger', fondo: 'dangerSoft' },
  no_requerido: { texto: 'textSecondary', fondo: 'backgroundSelected' },
};

type Props = {
  estado: Estado;
  etiqueta?: string;
};

export function BadgeEstado({ estado, etiqueta }: Props) {
  const tema = useTheme();
  const colores = COLORES[estado];

  return (
    <View style={[styles.badge, { backgroundColor: tema[colores.fondo] }]}>
      <ThemedText type="smallBold" themeColor={colores.texto} style={styles.texto}>
        {etiqueta ?? ETIQUETAS[estado]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  texto: {
    fontSize: 12,
  },
});
