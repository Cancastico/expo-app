import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import GreenButton from "@/components/Buttons/GreenButton";
import CommandTableModal from "@/components/modals/CommandTableModal";
import OrderFetch, { Order } from "@/services/fetchs/Order";
import StorageController from "@/services/storage";
import { useAxios } from "@/stores/axiosStore";
import { useBag } from "@/stores/bagStore";
import { useOrder } from "@/stores/orderStore";
import formatToCurrency from "@/utils/fortmatToCurrency";
import { getUTCDate } from "@/utils/getUtcDate";
import { getUTCHour } from "@/utils/getUtcHour";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Comandas() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [comandaModalOpen, setComandaModalOpen] = useState<boolean>(false);
  const [orderFetch, setOrderFetch] = useState<OrderFetch>();
  const { axios, setIP } = useAxios();
  const { clearOrder, setData } = useOrder();
  const { clearBag } = useBag();
  const storageController = new StorageController();
  const router = useRouter();

  async function getOrders() {
    setOrders([]);
    await orderFetch?.get().then((res) => {
      setOrders(res.data.result);
    });
  }

  function setOrder(comanda: number | null, mesa: number | null) {
    if (!comanda && !mesa) {
      return;
    }
    setData(comanda ?? undefined, mesa ?? undefined);
    router.navigate('/Produtos');
  }

  useFocusEffect(
    useCallback(() => {
      storageController.get('IP').then((res) => {
        if (res) {
          setIP(res);
        }
        clearOrder();
        clearBag();
      });
    }, [])
  );

  useEffect(() => {
    clearOrder();
    clearBag();
    getOrders();
  }, [orderFetch]);

  useEffect(() => {
    setOrderFetch(new OrderFetch(axios));
  }, [axios]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { router.navigate('/Configurações') }} style={styles.configButton}>
        <FontAwesome name="cog" size={24} color="black" />
        <Text style={styles.configText}>Configurações</Text>
      </TouchableOpacity>
      <Text>{}</Text>
      <ScrollView style={styles.scrollView}>
        {orders.map((order, index) => {
          return (
            <TouchableOpacity onPress={() => { setOrder(order.NUMERO_COMANDA, order.NUMERO_MESA) }} style={styles.orderContainer} key={index}>
              <View style={styles.orderInfo}>
                {order.NUMERO_COMANDA && (
                  <Text style={styles.orderText}>COMANDA: {order.NUMERO_COMANDA}</Text>
                )}
                {order.NUMERO_MESA && (
                  <Text style={styles.orderText}>MESA: {order.NUMERO_MESA}</Text>
                )}
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderDetail}>Ultimo Pedido: {getUTCDate(new Date(order.DATA_ULTIMA_ALTERACAO))} {getUTCHour(new Date(order.ULTIMA_ALTERACAO))}</Text>
              </View>
              <View style={styles.orderTotal}>
                <Text style={styles.orderDetail}>Total: R${formatToCurrency(order.VALOR_TOTAL_PRODUTOS)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <CommandTableModal
        isOpen={comandaModalOpen}
        setData={setData}
        onClose={() => {
          setComandaModalOpen(false);
        }}
      />
      <GreenButton
        label="Novo Pedido"
        onPress={() => setComandaModalOpen(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27272a',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 4,
    gap: 2,
  },
  configButton: {
    backgroundColor: '#d1d5db',
    flexDirection: 'row',
    gap: 2,
    padding: 2,
    borderRadius: 16,
  },
  configText: {
    fontSize: 20,
    color: 'black',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
  },
  orderContainer: {
    flexDirection: 'column',
    gap: 4,
    backgroundColor: '#475569',
    width: '100%',
    padding: 4,
    marginBottom: 2,
    borderRadius: 8,
  },
  orderInfo: {
    flexDirection: 'row',
    gap: 2,
  },
  orderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  orderDetail: {
    color: 'white',
    fontSize: 18,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
