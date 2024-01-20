import { ImageProps, StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface CartItemProps {
    id: string;
    title: string;
    roasted: string;
    prices: any;
    type: string;
    incrementCartItemQuantityHandler:any;
    decrementCartItemQuantityHandler:any;
    imagelink_square: ImageProps 
}

const CartItem = () => {
  return (
    <View>
      <Text>CartItem</Text>
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({})