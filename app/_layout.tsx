import { Stack } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import ToastManager from 'toastify-react-native'

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("light");
    }, 0);
  }, []);

  return (
    <>
      <ToastManager position='top' positionValue={0} width={400} />
      <Stack screenOptions={{ headerShown: false }} initialRouteName='Comanda' >
        <Stack.Screen name="index" options={{ title: "Comandas" }} />
        <Stack.Screen name="Configuracoes" options={{ title: "Configuracoes" }} />
        <Stack.Screen name="Produtos" options={{ title: "Produtos" }} />
        <Stack.Screen name="Sacola" options={{ title: "Sacola" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

