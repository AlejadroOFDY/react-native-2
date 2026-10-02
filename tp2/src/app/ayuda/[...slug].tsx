import { Link, Stack, useLocalSearchParams } from 'expo-router';

import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';

const contenidos: Record<string, { titulo: string; cuerpo: string }> = {
  horarios: {
    titulo: 'Horarios del comedor',
    cuerpo: 'El comedor atiende de lunes a viernes de 7:30 a 15:00. Los pedidos se reciben hasta las 14:30.',
  },
  'pagos/efectivo': {
    titulo: 'Pagar en efectivo',
    cuerpo: 'Podés abonar en efectivo en la caja al retirar tu pedido. Se entrega ticket con el número de turno.',
  },
  'pagos/tarjeta': {
    titulo: 'Pagar con tarjeta',
    cuerpo: 'Aceptamos tarjetas de débito y crédito. El cobro se realiza al confirmar el pedido.',
  },
  retiro: {
    titulo: 'Retiro de pedidos',
    cuerpo: 'Escuchá el número de turno. Cuando la cocina lo atiende, podés pasar a retirarlo por la ventanilla.',
  },
};

export default function AyudaArticuloScreen() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const ruta = Array.isArray(slug) ? slug.join('/') : (slug ?? '');
  const articulo = contenidos[ruta];

  return (
    <Pantalla>
      <Stack.Screen options={{ title: articulo?.titulo ?? 'Artículo' }} />

      {articulo ? (
        <>
          <ThemedText type="subtitle">{articulo.titulo}</ThemedText>
          <ThemedText themeColor="textSecondary">{articulo.cuerpo}</ThemedText>
        </>
      ) : (
        <>
          <ThemedText type="subtitle">Artículo no encontrado</ThemedText>
          <ThemedText themeColor="textSecondary">
            No hay contenido de ayuda para «/ayuda/{ruta}».
          </ThemedText>
        </>
      )}

      <Link href="/ayuda">
        <ThemedText type="linkPrimary">Volver al índice de ayuda</ThemedText>
      </Link>
    </Pantalla>
  );
}
