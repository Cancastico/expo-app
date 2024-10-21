import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import GreenButton from "@/components/Buttons/GreenButton";
import OrderFetch from "@/services/fetchs/Order";
import { useAxios } from "@/stores/axiosStore";
import { useBag } from "@/stores/bagStore";
import { useOrder } from "@/stores/orderStore";
import formatToCurrency from "@/utils/fortmatToCurrency";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Sacola({ navigation }: any) {
  const { items, totalValue, updateItemQuantity, clearBag } = useBag();
  const { comanda, mesa, setData } = useOrder();
  const { axios } = useAxios();
  const [orderFetch, setOrderFetch] = useState<OrderFetch>();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setOrderFetch(new OrderFetch(axios));
    }, [])
  );

  async function handleSubmit() {
    await orderFetch?.create(items, comanda, mesa).then(() => {
      clearBag();
      setData(undefined, undefined);
      router.dismissAll();
      router.navigate('/');
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="arrowleft" size={32} color="white" onPress={() => { navigation.goBack() }} />
        <Text style={styles.headerText}>SACOLA</Text>
        <AntDesign name="closecircleo" size={32} color="red" onPress={clearBag} />
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Comanda: {comanda}</Text>
        <Text style={styles.subHeaderText}>Mesa: {mesa}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemDescription}>{item.description.toUpperCase()}</Text>
            </View>
            {item.observation && (
              <View style={styles.itemObservation}>
                <Text style={styles.itemLabel}>OBSERVAÇÃO:</Text>
                <Text style={styles.itemObservationText}>{item.observation}</Text>
              </View>
            )}
            <View style={styles.itemInfo}>
              <View style={styles.itemQuantity}>
                <Text style={styles.itemLabel}>QUANTIDADE</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => updateItemQuantity(index, -1)} style={styles.quantityButton}>
                    {item.quantity > 1 ? (
                      <AntDesign name="minus" size={24} color="white" />
                    ) : (
                      <FontAwesome name="trash-o" size={24} color="white" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateItemQuantity(index, 1)} style={styles.quantityButton}>
                    <AntDesign name="plus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemPrice}>
                <Text style={styles.itemLabel}>PREÇO</Text>
                <Text style={styles.itemPriceText}>{formatToCurrency(item.quantity * item.unValue)}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {totalValue > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>Valor Total</Text>
            <Text style={styles.footerText}>{formatToCurrency(totalValue)}</Text>
          </View>
          <View style={styles.footerButton}>
            <GreenButton onPress={handleSubmit} label="Finalizar" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: '#27272a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  subHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flexDirection: 'column',
    gap: 16,
    backgroundColor: '#475569',
    width: '100%',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemDetails: {
    justifyContent: 'space-between',
  },
  itemDescription: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemObservation: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  itemObservationText: {
    color: 'white',
    fontSize: 24,
    minWidth: 32,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '50%',
    gap: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1E293B',
  },
  quantityText: {
    color: 'white',
    fontSize: 24,
  },
  itemPrice: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '50%',
    maxWidth: 128,
  },
  itemPriceText: {
    color: 'white',
    fontSize: 24,
    minWidth: 32,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    width: '100%',
    backgroundColor: '#3f3f46',
    padding: 16,
    position: 'absolute',
    bottom: 0,
  },
  footerText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 24,
  },
  footerButton: {
    width:'50%'
  },
});
