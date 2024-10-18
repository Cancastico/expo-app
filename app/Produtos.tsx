import GreenButton from "@/components/Buttons/GreenButton";
import Dropdown from "@/components/Dropdown";
import ProductModal from "@/components/modals/ProductModal";
import { useAxios } from "@/stores/axiosStore";
import { useBag } from "@/stores/bagStore";
import { Product } from "@/types/Product";
import formatToCurrency from "@/utils/fortmatToCurrency";
import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, Keyboard, TouchableWithoutFeedback, View, Text, TextInput, StyleSheet } from "react-native";
import { z } from "zod";

export type SearchProductType = { label: string, value: string };

export default function Produtos() {
  const [searchBy, setSearchBy] = useState<SearchProductType>({ label: 'Descrição', value: 'DESCRICAO' });
  const [products, setProducts] = useState<Product[]>([]);
  const [seletedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [pagination, setPagination] = useState<{ page: number, hasMore: boolean }>({ page: 1, hasMore: true });
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const { totalValue } = useBag();
  const { axios } = useAxios();
  const router = useRouter();

  async function getProducts() {
    if (!pagination.hasMore) {
      return;
    }
    let request: Promise<AxiosResponse<{ result: Product[], totalPage: number }, any>>;
    if (searchBy.value == 'DESCRICAO') {
      request = axios.get<{ result: Product[], totalPage: number }>(`/Product/getInfosProductByDesc/${pagination.page}`, {
        params: { [searchBy.value]: watch('search') }
      });
    } else {
      request = axios.get<{ result: Product[], totalPage: number }>(`/Product/getInfosProductByCod/${pagination.page}`, {
        params: { [searchBy.value]: watch('search') }
      });
    }
    await request.then((response) => {
      if (response.data.result.length == 0) {
        setPagination(prevPagination => ({ ...prevPagination, hasMore: false }));
      }
      setProducts(prevProducts => [...prevProducts, ...response.data.result]);
      Keyboard.dismiss();
    });
  }

  const searchSchema = z.object({
    search: z.optional(z.string()),
  });

  type SarchForm = z.infer<typeof searchSchema>;

  const { control, handleSubmit, watch, setValue } = useForm<SarchForm>({ resolver: zodResolver(searchSchema) });

  useEffect(() => {
    if (pagination.hasMore) {
      getProducts();
    }
  }, [pagination]);

  function reset() {
    setProducts([]);
    setPagination({ page: 1, hasMore: true });
  }

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

  const searchByList: SearchProductType[] = [{ label: 'Descrição', value: 'DESCRICAO' }, { label: 'Código', value: 'CODIGO' }];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PRODUTOS</Text>
        <AntDesign style={styles.backIcon} name="arrowleft" size={32} color="white" onPress={() => { router.canGoBack(); }} />
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Controller
            control={control}
            name="search"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar produtos"
                placeholderTextColor="#FFFFFF"
                multiline={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Dropdown
            defaultValue={searchBy}
            onChange={(e) => { setValue('search', ''); setSearchBy(e); reset(); }}
            options={searchByList}
          />
        </View>
        <GreenButton
          label="Buscar"
          onPress={handleSubmit(reset)}
        />
      </View>
      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => { setSelectedProduct(item) }}>
              <View style={styles.productCard}>
                <View style={styles.productDetails}>
                  <Text style={styles.productDescription}>{item.DESCRICAO.toUpperCase()}</Text>
                </View>
                <View style={styles.productInfo}>
                  <View style={styles.productCode}>
                    <Text style={styles.productLabel}>CODIGO</Text>
                    <Text style={styles.productValue}>{item.CODIGO}</Text>
                  </View>
                  <View style={styles.productPrice}>
                    <Text style={styles.productLabel}>PREÇO</Text>
                    <Text style={styles.productValue}>{formatToCurrency(item.PRECO_VENDA)}</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          onEndReached={() => { setPagination(prevPag => ({ ...prevPag, page: prevPag.page + 1 })) }}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>Produtos não encontrados</Text>
        </View>
      )}
      {(totalValue > 0) && !keyboardOpen && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>Valor Total</Text>
            <Text style={styles.footerText}>{formatToCurrency(totalValue)}</Text>
          </View>
          <GreenButton
            label="Ver Sacola"
            onPress={() => { router.navigate('/Sacola'); }}
          />
        </View>
      )}
      <ProductModal isOpen={seletedProduct != undefined} onClose={() => { setSelectedProduct(undefined); }} product={seletedProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27272a',
    paddingTop: 10,
    width: '100%',
    position: 'relative',
  },
  header: {
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
  },
  searchContainer: {
    padding: 16,
    flexDirection: 'column',
    gap: 20,
  },
  searchRow: {
    flexDirection: 'row',
    width: '100%',
  },
  searchInput: {
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    paddingLeft: 16,
    borderRadius: 12,
    height: 64,
    width: '70%',
  },
  productCard: {
    flexDirection: 'column',
    gap: 16,
    backgroundColor: '#475569',
    width: '100%',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  productDetails: {
    justifyContent: 'space-between',
  },
  productDescription: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productCode: {
    width: '50%',
  },
  productPrice: {
    width: '50%',
    alignItems: 'center',
    maxWidth: 128,
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
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
  },
  noProductsText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 24,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#3f3f46',
    bottom: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 24,
  },
})