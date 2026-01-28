import { Image } from 'expo-image';
import { FC } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useImagesStore } from 'store/images-store';

type GalleryGridItemProps = {
  item: string;
  itemSize: number;
  onPress: (e: GestureResponderEvent) => void;
  onHide?: (e: GestureResponderEvent) => void;
};

const GalleryGridItem: FC<GalleryGridItemProps> = ({ item, itemSize, onPress, onHide }) => {
  const { images, hiddenImageIds } = useImagesStore();

  const imageItem = images[item];
  const isHidden = hiddenImageIds?.[item];

  if (!imageItem || isHidden) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="mb-2.5 overflow-hidden rounded-2xl"
      onPress={onPress}>
      <View style={[{ width: itemSize, height: itemSize }]}>
        <Image
          source={{ uri: imageItem.download_url }}
          style={StyleSheet.absoluteFill}
          cachePolicy={'memory-disk'}
          contentFit="cover"
        />
        <View className="absolute right-[10] top-[10] z-10 overflow-hidden rounded-full bg-white p-2">
          <TouchableOpacity onPress={onHide} hitSlop={8} className="shadow-lg shadow-black">
            <MaterialIcons name="hide-image" size={18} color="#192740" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { GalleryGridItem };
