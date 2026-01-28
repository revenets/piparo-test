import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { FC } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  PlatformColor,
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
import { MaterialIcons } from '@expo/vector-icons';
import { useImagesStore } from 'store/images-store';

type GalleryImageItemProps = {
  item: string;
  index: number;
  y: SharedValue<number>;
  onPress?: (e: GestureResponderEvent) => void;
  onHide?: (e: GestureResponderEvent) => void;
};

const { height } = Dimensions.get('window');

export const MAX_ITEM_HEIGHT = height * 0.35;
export const MIN_ITEM_HEIGHT = MAX_ITEM_HEIGHT * 0.4;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const GalleryImageItem: FC<GalleryImageItemProps> = ({ index, item, y, onPress, onHide }) => {
  const { images, hiddenImageIds } = useImagesStore();

  const imageItem = images[item];
  const isHidden = hiddenImageIds?.[item];

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

  if (!imageItem || isHidden) {
    return null;
  }

  return (
    <TouchableOpacity activeOpacity={0.8} className="overflow-hidden" onPress={onPress}>
      <View className="w-screen" style={[{ height: MAX_ITEM_HEIGHT }]}>
        <Image
          source={{ uri: imageItem.download_url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </View>
      <View className="absolute right-[10] top-[10] z-10 overflow-hidden rounded-full bg-white p-2">
        <TouchableOpacity onPress={onHide} hitSlop={8} className="shadow-lg shadow-black">
          <MaterialIcons name="hide-image" size={18} color="#192740" />
        </TouchableOpacity>
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
