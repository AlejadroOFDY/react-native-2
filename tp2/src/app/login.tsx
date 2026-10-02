import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const { login } = useApp();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const entrar = () => {
    if (!login(usuario.trim(), clave)) {
      setError('Usuario o clave incorrectos.');
    }
  };

  return (
    <Pantalla>
      <Stack.Screen options={{ title: 'Ingreso de cocina' }} />
      <ThemedText themeColor="textSecondary">
        Solo el personal de cocina puede atender pedidos. Al iniciar sesión, este modal se cierra
        solo y aparece la sección Cocina.
      </ThemedText>

      <TextInput
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Usuario"
        autoCapitalize="none"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />
      <TextInput
        value={clave}
        onChangeText={setClave}
        placeholder="Clave"
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      {error.length > 0 && <ThemedText style={styles.error}>{error}</ThemedText>}

      <Boton titulo="Ingresar" variante="primario" onPress={entrar} />
      <ThemedText type="small" themeColor="textSecondary">
        Demo: usuario «cocina» / clave «cocina123».
      </ThemedText>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  error: {
    color: '#d9534f',
  },
});
