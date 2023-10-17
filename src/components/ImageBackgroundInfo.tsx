import {
  ImageBackground,
  ImageProps,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import GradientBgIcons from './GradientBgIcons';
import {COLORS, FONTSIZE, SPACING} from '../theme/theme';

interface ImageBackgroundInfoProps {
  EnableBackHandler: boolean;
  imageLink_portrait: ImageProps;
  type: string;
  id: string;
  favorite: boolean;
  name: string;
  special_ingredient: string;
  ingredients: string;
  average_ratting: number;
  ratings_count: string;
  roasted: string;
  BackHandler?: any;
  ToggleFavorite: any;
}

const ImageBackgroundInfo: React.FC<ImageBackgroundInfoProps> = ({
  EnableBackHandler,
  ToggleFavorite,
  average_ratting,
  favorite,
  id,
  imageLink_portrait,
  ingredients,
  name,
  ratings_count,
  roasted,
  special_ingredient,
  type,
  BackHandler,
}) => {
  return (
    <View>
      <ImageBackground
        source={imageLink_portrait}
        style={styles.itemBackGroundImage}>
        {EnableBackHandler ? (
          <View style={styles.imageHeaderBarContainerWithBack}>
            <TouchableOpacity onPress={BackHandler}>
              <GradientBgIcons
                name="left"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_16}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              ToggleFavorite(favorite,type,id)
            }}>
            <GradientBgIcons
                name="like"
                color={favorite ? COLORS.primaryRedHex: COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_16}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageHeaderBarContainerWithoutBack}>
           
            <TouchableOpacity>
            <GradientBgIcons
                name="like"
                color={favorite ? COLORS.primaryRedHex: COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_16}
              />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBackGroundImage: {
    width: '100%',
    aspectRatio: 200 / 250,
    justifyContent: 'space-between',
  },
  imageHeaderBarContainerWithBack: {
    padding: SPACING.space_30,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageHeaderBarContainerWithoutBack: {
    padding: SPACING.space_30,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
});

export default ImageBackgroundInfo;
