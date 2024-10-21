import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Modal, Text, TextInput, View, StyleSheet } from "react-native";
import { z } from 'zod';
import GreenButton from "../Buttons/GreenButton";
import { useRouter } from "expo-router";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setData: (comanda?: number, mesa?: number) => void
};

export default function CommandTableModal({ isOpen, onClose, setData }: Props) {
  const [modalOpen, setModalOpen] = useState<boolean>(isOpen);
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const router = useRouter();

  const addProductSchema = z.object({
    mesa: z.number().optional(),
    comanda: z.number().optional(),
  }).refine(data => data.mesa || data.comanda, {
    message: "Pelo menos um dos campos deve ser preenchido.",
  });

  type formData = z.infer<typeof addProductSchema>;

  const { handleSubmit, reset, formState: { errors, dirtyFields }, control } = useForm<formData>({
    resolver: zodResolver(addProductSchema)
  });

  function handleClose() {
    onClose();
    setModalOpen(false);
    reset();
  }

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOpen(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function submit(newItem: formData) {
    setData(newItem.comanda, newItem.mesa);
    router.navigate('/Produtos');
    handleClose();
  }

  return (
    <Modal
      animationType="slide"
      visible={modalOpen}
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <AntDesign name="arrowleft" size={32} color="white" onPress={handleClose} />
        </View>

        {/* COMANDA */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comanda:</Text>
          <Controller
            control={control}
            name="comanda"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Digite aqui o número da comanda"
                placeholderTextColor="white"
                onBlur={onBlur}
                onChangeText={(e) => {
                  const numericValue = e.replace(/[^0-9]/g, '');
                  onChange(parseInt(numericValue));
                }}
                value={value?.toString()}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        {/* MESA */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mesa:</Text>
          <Controller
            control={control}
            name="mesa"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Digite aqui o número da mesa"
                placeholderTextColor="white"
                onBlur={onBlur}
                onChangeText={(e) => {
                  const numericValue = e.replace(/[^0-9]/g, '');
                  onChange(parseInt(numericValue));
                }}
                value={value?.toString()}
                keyboardType="numeric"
              />
            )}
          />
        </View>

      </View>
        {/* BUTTON */}
        <View style={[styles.footer, keyboardOpen && { display: 'none' }]}>
          <GreenButton
            label="Ver Produtos"
            disabled={(!dirtyFields.comanda && !dirtyFields.mesa)}
            onPress={handleSubmit(submit)}
          />
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position:'relative',
    height:'100%',
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#27272a',
  },
  header: {
    padding: 16,
    backgroundColor: '#282828',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#444',
    color: 'white',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  footer: {
    position:'absolute',
    bottom:0,
    padding: 16,
    width:'100%',
    backgroundColor: '#282828',
  }
});
