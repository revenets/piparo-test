import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { FC } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import { ImageDto } from 'types/image-dto.type';

type GalleryImageItemProps = {
  item: ImageDto;
  index: number;
  y: SharedValue<number>;
  onPress: (e: GestureResponderEvent) => void;
};

const { width, height } = Dimensions.get('window');

export const MAX_ITEM_HEIGHT = height * 0.35;
export const MIN_ITEM_HEIGHT = MAX_ITEM_HEIGHT * 0.4;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const GalleryImageItem: FC<GalleryImageItemProps> = ({ index, item, y, onPress }) => {
  const overlayAnimatedProps = useAnimatedProps(() => ({
    intensity: interpolate(
      y.value,
      [
        (index - 2) * MAX_ITEM_HEIGHT,
        (index - 1) * MAX_ITEM_HEIGHT,
        index * MAX_ITEM_HEIGHT,
        (index + 2) * MAX_ITEM_HEIGHT,
      ],
      [15, 0, 0, 15],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} className="overflow-hidden" onPress={onPress}>
      <View className='w-screen' style={[{ height: MAX_ITEM_HEIGHT }]}>
        <Image
          source={{ uri: item.download_url }}
          style={StyleSheet.absoluteFill}
          cachePolicy={'memory-disk'}
          contentFit="cover"
        />
      </View>
      <AnimatedBlurView
        tint="prominent"
        style={StyleSheet.absoluteFill}
        animatedProps={overlayAnimatedProps}
      />
    </TouchableOpacity>
  );
};

export { GalleryImageItem };
