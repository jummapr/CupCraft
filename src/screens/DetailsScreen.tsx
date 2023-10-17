import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useStore} from '../store/store';
import { COLORS } from '../theme/theme';
import ImageBackgroundInfo from '../components/ImageBackgroundInfo';

const DetailsScreen = ({navigation, route}: any) => {
  // console.log("routes",route.params)
  const itemIndex = useStore((state: any) =>
    route.params.type == 'Coffee' ? state.CoffeeList : state.BeanList,
  )[route.params.index];

  const addToFavoriteList = useStore((state:any) => state.addToFavoriteList);
  const deleteFromFavoriteList = useStore((state:any) => state.deleteFromFavoriteList);


  const toggleFavorite = (favorite: boolean,type: string, id: string) => {
      favorite ? deleteFromFavoriteList(type,id) : addToFavoriteList(type,id)
  }

  const backHandler = () => {
    navigation.pop()
  }

  

  return (
    <View  style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollViewFlex}>
        <ImageBackgroundInfo 
            EnableBackHandler={true}
            ToggleFavorite={toggleFavorite}
            average_ratting={itemIndex.average_rating}
            favorite={itemIndex.favourite}
            id={itemIndex.id}
            imageLink_portrait={itemIndex.imagelink_portrait}
            ingredients={itemIndex.ingredients}
            name={itemIndex.name}
            ratings_count={itemIndex.ratings_count}
            roasted={itemIndex.roasted}
            special_ingredient={itemIndex.special_ingredient}
            type={itemIndex.type}
            BackHandler={backHandler}
            
         />
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex
  },
  ScrollViewFlex: {
    flexGrow: 1,

  }
});
