import { Item } from "@/types/Item";
import { AxiosInstance } from "axios";

type NewItem = {
  ID_PRODUTO: number,
  QUANTIDADE: number,
  VALOR_UNITARIO: number,
  VALOR_UNITARIO_PREVISTO: number,
  DESCRICAO_PRODUTO: string,
}

export type Order = {
  ID_PEDIDO: number;
  NOME_VENDEDOR: string;
  DATA_DO_PEDIDO: string; // ou Date, se você preferir trabalhar com objetos Date
  HORA_DO_PEDIDO: string; // ou Date, se você preferir trabalhar com objetos Date
  NOME_CLIENTE: string;
  VALOR_TOTAL_PRODUTOS: number;
  NUMERO_COMANDA:number;
  NUMERO_MESA:number;
  ULTIMA_ALTERACAO:string;
  DATA_ULTIMA_ALTERACAO:string;
};

export default class OrderFetch {
  private axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async create(items: Item[], comanda?: number | null, mesa?: number | null) {
    return await this.axios.post('/Order', {
      username: 'Teste',
      numero_da_comanda: comanda,
      numero_da_mesa: mesa,
      items: items.map((item) => {
        return {
          ID_PRODUTO: item.idProduct,
          QUANTIDADE: item.quantity,
          VALOR_UNITARIO: item.unValue,
          VALOR_UNITARIO_PREVISTO: item.unValue,
          DESCRICAO_PRODUTO: item.description,
          OBSERVACAO:item.observation ?? null
        }
      })
    })
  }

  async get() {
    return await this.axios.get<{result:Order[]}>('/Order');
  }
}