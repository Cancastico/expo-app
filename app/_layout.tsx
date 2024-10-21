import { Stack } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("light");
    }, 0);
  }, []);

  return (
    <Stack screenOptions={{headerShown:false}} initialRouteName='Comanda' >
      <Stack.Screen name="Comandas" options={{ title: "Comandas" }} />
      <Stack.Screen name="Configuracoes" options={{ title: "Configuracoes" }} />
      <Stack.Screen name="Produtos" options={{ title: "Produtos" }} />
      <Stack.Screen name="Sacola" options={{ title: "Sacola" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

