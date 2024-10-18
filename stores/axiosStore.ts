import { create } from 'zustand';
import axios, { AxiosInstance } from "axios";

type AxiosState = {
  ip:string;
  axios: AxiosInstance;
  setIP: (IP: string) => void;
}

const useAxios = create<AxiosState>((set) => ({
  ip:'192.168.0.183',
  axios: axios.create({
    baseURL: 'http://192.168.0.183:8080',
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  setIP: (IP: string) => set({
    ip:IP,
    axios: axios.create({
      baseURL:"http://" + IP + ':8080',
      headers: {
        "Content-Type": "application/json",
      },
    })
  })
}))

export { useAxios }