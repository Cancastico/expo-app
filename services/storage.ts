import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StorageController{
  async set(key:string, value:string){
    try {
      return await AsyncStorage.setItem(key,value);
    } catch (error:any) {
      console.error('Erro ao tentar salvar cache');
    }
  }
  async get(key:string){
    try {
      return await AsyncStorage.getItem(key);
    } catch (error:any) {
    }
  }
}