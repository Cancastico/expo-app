import { useBag } from "@/stores/bagStore";
import { Product } from "@/types/Product";
import formatToCurrency from "@/utils/fortmatToCurrency";
import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { z } from 'zod';
import GreenButton from "../Buttons/GreenButton";

type Props = {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProductModal({ isOpen, product, onClose }: Props) {
  const [modalOpen, setModalOpen] = useState<boolean>(isOpen);
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const { pushItem } = useBag();

  const addProductSchema = z.object({
    idProduct: z.number(),
    quantity: z.number(),
    unValue: z.number(),
    description: z.string(),
    observation: z.optional(z.string().max(256, 'Quantidade máxima de caracteres é 256')),
  });

  type formData = z.infer<typeof addProductSchema>;

  const { handleSubmit, reset, setValue, watch, getValues, control } = useForm<formData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      quantity: 1
    }
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
    if (product) {
      setValue('idProduct', product.ID_PRODUTO);
      setValue('unValue', product.PRECO_VENDA);
      setValue('description', product.DESCRICAO);
    }
  }, [product]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function submit(newItem: formData) {
    pushItem(newItem);
    handleClose();
  }

  function updateQuantity(value: number) {
    const newQuantity = Math.max(1, getValues('quantity') + value);
    setValue('quantity', newQuantity);
  }

  if (product) {
    return (
      <Modal
        animationType="slide"
        visible={modalOpen}
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <AntDesign name="arrowleft" size={32} color="white" onPress={handleClose} />
          </View>
          <View style={styles.productInfo}>
            <View style={styles.productDetails}>
              <Text style={styles.productDescription}>{product.DESCRICAO.toUpperCase()}</Text>
            </View>
            <View style={styles.productCodePrice}>
              <View style={styles.productCode}>
                <Text style={styles.productLabel}>CODIGO</Text>
                <Text style={styles.productValue}>{product.CODIGO}</Text>
              </View>
              <View style={styles.productPrice}>
                <Text style={styles.productLabel}>PREÇO UNITARIO</Text>
                <Text style={styles.productValue}>{formatToCurrency(product.PRECO_VENDA)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.observationsContainer}>
            <Text style={styles.productLabel}>Observações:</Text>
            <Controller
              control={control}
              name="observation"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Digite aqui as Observações..."
                  placeholderTextColor="#FFFFFF"
                  multiline={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          {!keyboardOpen && (
            <View style={styles.footer}>
              <View style={styles.priceCounterContainer}>
                <View style={styles.productPriceTotal}>
                  <Text style={styles.productPriceTotalLabel}>PREÇO</Text>
                  <Text style={styles.productPriceTotalValue}>{formatToCurrency(watch('quantity') * product.PRECO_VENDA)}</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    disabled={watch('quantity') == 1}
                    onPress={() => { updateQuantity(-1) }}
                    style={[styles.counterButton, watch('quantity') == 1 && styles.counterButtonDisabled]}
                  >
                    <AntDesign name="minus" size={32} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{watch('quantity')}</Text>
                  <TouchableOpacity
                    onPress={() => { updateQuantity(+1) }}
                    style={styles.counterButton}
                  >
                    <AntDesign name="plus" size={32} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <GreenButton
                label="Adicionar"
                onPress={handleSubmit(submit)}
              />
            </View>
          )}
        </View>
      </Modal>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#27272a',
  },
  header: {
    backgroundColor: '#3f3f46',
    padding: 16,
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#27272a',
    gap: 8,
  },
  productDetails: {
    justifyContent: 'space-between',
  },
  productDescription: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productCodePrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productCode: {
    width: '50%',
  },
  productPrice: {
    width: '50%',
    alignItems: 'center',
    maxWidth: 192,
  },
  productLabel: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  productValue: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  observationsContainer: {
    padding: 16,
    gap: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    fontSize: 20,
    color: '#FFFFFF',
    maxHeight: 256,
  },
  footer: {
    backgroundColor: '#3f3f46',
    padding: 16,
    gap: 8,
  },
  priceCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productPriceTotal: {
    width: '50%',
    alignItems: 'center',
  },
  productPriceTotalLabel: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  productPriceTotalValue: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
  },
  counterContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  counterButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1E293B',
  },
  counterButtonDisabled: {
    backgroundColor: '#3B3B3B',
  },
  quantity: {
    color: '#FFFFFF',
    fontSize: 40,
  },
});

