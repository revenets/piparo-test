import { FC } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Pressable,
  View,
  Text,
  Modal,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';

import { useImagesStore } from 'store/images-store';

type ImageInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  imageId: string | null;
};

const ImageInfoModal: FC<ImageInfoModalProps> = ({ visible, onClose, imageId }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { images } = useImagesStore();

  if (!visible || !imageId) return null;

  const image = images[imageId];

  if (!image) {
    return null;
  }

  const infoBoxWidth = screenWidth * 0.85;

  const imageSize = 300;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center" onPress={onClose}>
        <Image
          source={{ uri: image.download_url }}
          priority="high"
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          blurRadius={40}
        />

        <View className="shadow-sm shadow-black">
          <Pressable
            className="items-center rounded-2xl bg-white px-4 pb-6 pt-4"
            style={{ width: infoBoxWidth }}
            onPress={(e) => e.stopPropagation()}>
            <View className="mb-5 self-end rounded-full bg-white p-1 shadow-sm shadow-black">
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View className="relative overflow-hidden rounded-xl">
              <Image
                source={{ uri: image.download_url }}
                className="rounded-xl"
                style={{ width: imageSize, height: imageSize }}
                contentFit="cover"
                priority="high"
                cachePolicy="memory-disk"
                placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                transition={200}
              />
              <View
                className="absolute bottom-0 left-0 right-0 top-0 rounded-xl"
                style={styles.grayscaleOverlay}
              />
            </View>

            <View className="mt-4 w-full gap-2.5 px-2">
              <Text className="mb-4 font-bold">{image.author}</Text>
              <View className="flex-row gap-4 ">
                <Text>Width: {image.width}px</Text>
                <Text>Height: {image.height}px</Text>
              </View>
              <View className="flex-row items-center  gap-1">
                <MaterialIcons name="download" size={16} color="#000" />
                <Text onPress={() => Linking.openURL(image.download_url)}>
                  {image.download_url}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  grayscaleOverlay: {
    backgroundColor: '#808080',
    mixBlendMode: 'saturation',
  },
});

export { ImageInfoModal };
