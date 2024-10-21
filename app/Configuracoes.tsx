import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { z } from "zod";
import GreenButton from "@/components/Buttons/GreenButton";
import StorageController from "@/services/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Configuracoes() {
  const storageController = new StorageController();
  const formSchema = z.object({
    ipDatabase: z.string()
  });
  const router = useRouter();

  type form = z.infer<typeof formSchema>;
  const { handleSubmit, control, formState: { isDirty }, setValue } = useForm<form>({
    resolver: zodResolver(formSchema)
  });

  function submit(form: form) {
    storageController.set('IP', form.ipDatabase).then(() => {
      router.navigate('/');
    });
  }

  useFocusEffect(
    useCallback(() => {
      storageController.get('IP').then((response) => {
        if (response) {
          setValue('ipDatabase', response);
        }
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CONFIGURAÇÕES</Text>
        <AntDesign style={styles.backIcon} name="arrowleft" size={32} color="white" onPress={() => { router.navigate('/') }} />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IP:</Text>
          <Controller
            control={control}
            name="ipDatabase"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Digite aqui o IP da base de dados"
                placeholderTextColor="#FFFFFF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <GreenButton
          label="Salvar"
          disabled={!isDirty}
          onPress={handleSubmit(submit)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27272a',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 10,
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  backIcon: {
    position: 'absolute',
    left: 24,
    top: 16,
  },
  formContainer: {
    width: '100%',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flexDirection: 'column',
    width: '100%',
    gap: 2,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 24,
  },
  input: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    fontSize: 20,
    color: '#FFFFFF',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
});
