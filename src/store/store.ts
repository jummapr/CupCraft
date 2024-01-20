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
                state.cartList[index].prices.sort((a: any, b: any) => {
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
                const price = parseFloat(state.cartList[index].prices[i].price);
                const quantity = state.cartList[index].prices[i].quantity;

                if (!isNaN(price) && !isNaN(quantity)) {
                  tempPrice += price * quantity;
                } else {
                  console.warn(
                    `Invalid price or quantity for item ${state.cartList[index].id}`,
                  );
                }
              }

              // console.log(
              //   'tempPrice for item',
              //   state.cartList[index].id,
              //   tempPrice,
              // );

              if (!isNaN(tempPrice)) {
                state.cartList[index].ItemPrice = tempPrice.toFixed(2);
              } else {
                console.warn(
                  `Invalid tempPrice for item ${state.cartList[index].id}`,
                );
              }

              // console.log(
              //   'ItemPrice after update',
              //   state.cartList[index].id,
              //   state.cartList[index].ItemPrice,
              // );

              if (!isNaN(tempPrice)) {
                totalPrice += tempPrice;
              } else {
                console.warn(
                  `Invalid tempPrice for item ${state.cartList[index].id} in the total`,
                );
              }
            }

            // console.log('Total Price before update', totalPrice);

            if (!isNaN(totalPrice)) {
              state.cartPrice = totalPrice.toFixed(2);
            } else {
              console.warn('Invalid totalPrice');
            }

            // console.log('Total Price after update', state.cartPrice);
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
      incrementCartItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.cartList.length; i++) {
              if (state.cartList[i].id == id) {
                for (let j = 0; j < state.cartList[i].prices.length; j++) {
                  if (state.cartList[i].prices[j].size == size) {
                    state.cartList[i].prices[j].quantity++;
                    break;
                  }
                }
              }
            }
          }),
        ),
      decrementCartListQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.cartList.length; i++) {
              if (state.cartList[i].id == id) {
                for (let j = 0; j < state.cartList[i].prices.length; j++) {
                  if (state.cartList[i].prices[j].size == size) {
                    if (state.cartList[i].prices.length > 1) {
                      if (state.cartList[i].prices[j].quantity > 1) {
                        state.cartList[i].prices[j].quantity--;
                      } else {
                        state.cartList[i].prices.splice(j, 1);
                      }
                    } else {
                      if (state.cartList[i].prices[j].quantity > 1) {
                        state.cartList[i].prices[j].quantity--;
                      } else {
                        state.cartList.splice(i, 1);
                      }
                    }
                    break;
                  }
                }
              }
            }
          }),
        ),
      addToOrderHistoryListFromCartList: () =>
        set(
          produce(state => {
            let temp = state.cartList.reduce(
              (acc: number, currentValue: any) =>
                acc + parseFloat(currentValue.ItemPrice),
              0,
            );

            if (state.orderHistoryList.length > 0) {
              state.orderHistoryList.unshift({
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                cartList: state.cartList,
                cartListPrice: temp.toFixed(2).toString(),
              });
            } else {
              state.orderHistoryList.push({
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                cartList: state.cartList,
                cartListPrice: temp.toFixed(2).toString(),
              });
            }
            state.cartList = [];
          }),
        ),
    }),

    {
      name: 'coffee-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
