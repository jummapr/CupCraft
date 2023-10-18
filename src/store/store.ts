import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/coffeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, get) => ({
      CoffeeList: CoffeeData,
      BeanList: BeansData,
      cartPrice: 0,
      FavoriteList: [],
      cartList: [],
      orderHistoryList: [],
      addToCart: (cartItem: any) =>
        set(
          produce(state => {
            let found = false;
            for (let index = 0; index < state.cartList.length; index++) {
              if (state.cartList[index].id == cartItem.id) {
                found = true;
                let size = false;
                for (let i = 0; i < state.cartList[index].prices.length; i++) {
                  if (
                    state.cartList[index].prices[i].size == cartItem.prices[0]
                  ) {
                    size = true;
                    state.cartList[index].prices[i].quantity++;
                    break;
                  }
                }
                if (size == false) {
                  state.cartList[index].prices.push(cartItem.prices[0]);
                }
                state.cartItem[index].price.sort((a: any, b: any) => {
                  if (a.size > b.size) {
                    return -1;
                  }
                  if (a.size < b.size) {
                    return 1;
                  }

                  return 0;
                });
                break;
              }
            }
            if (found == false) {
              state.cartList.push(cartItem);
            }
          }),
        ),
      calculateCartPrice: () =>
        set(
          produce(state => {
            let totalPrice = 0;
            for (let index = 0; index < state.cartList.length; index++) {
              let tempPrice = 0;
              for (let i = 0; i < state.cartList[index].prices.length; i++) {
                tempPrice =
                  tempPrice +
                  parseFloat(state.cartList[index].prices[i].price) *
                    state.cartList[index].prices[i].quantity;
              }
              state.cartList[index].ItemPrice = tempPrice.toFixed(2).toString();
              totalPrice = totalPrice + tempPrice;
            }
            state.cartPrice = totalPrice.toFixed(2).toString();
          }),
        ),
      addToFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type == 'Coffee') {
              for (let index = 0; index < state.CoffeeList.length; index++) {
                if (state.CoffeeList[index].id == id) {
                  if (state.CoffeeList[index].favourite == false) {
                    state.CoffeeList[index].favourite = true;
                    state.FavoriteList.unshift(state.CoffeeList[index]);
                  }
                  break;
                }
              }
            } else if (type == 'Bean') {
              for (let index = 0; index < state.BeanList.length; index++) {
                if (state.BeanList[index].id == id) {
                  if (state.BeanList[index].favourite == false) {
                    state.BeanList[index].favourite = true;
                    state.FavoriteList.unshift(state.BeanList[index]);
                  }
                  break;
                }
              }
            }
          }),
        ),
      deleteFromFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type == 'Coffee') {
              for (let index = 0; index < state.CoffeeList.length; index++) {
                if (state.CoffeeList[index].id == id) {
                  if (state.CoffeeList[index].favourite == true) {
                    state.CoffeeList[index].favourite = false;
                  }
                  break;
                }
              }
            } else if (type == 'Bean') {
              for (let index = 0; index < state.BeanList.length; index++) {
                if (state.BeanList[index].id == id) {
                  if (state.BeanList[index].favourite == true) {
                    state.BeanList[index].favourite = false;
                  }
                  break;
                }
              }
            }

            let spliceIndex = -1;
            for (let index = 0; index < state.FavoriteList.length; index++) {
              if (state.FavoriteList[index].id == id) {
                spliceIndex = index;
                break;
              }
            }
            state.FavoriteList.splice(spliceIndex, 1);
          }),
        ),
    }),
    {
      name: 'coffee-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
