import { FC } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Pressable,
  View,
  Text,
  Modal,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';

import { ImageDto } from 'types/image-dto.type';

type ImageInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  image: ImageDto | null;
};

const ImageInfoModal: FC<ImageInfoModalProps> = ({ visible, onClose, image }) => {
  const { width: screenWidth } = useWindowDimensions();

  if (!visible || !image) return null;

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

        <Pressable
          className="items-center rounded-2xl bg-white px-4 py-6"
          style={{ width: infoBoxWidth }}
          onPress={(e) => e.stopPropagation()}>
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

          <View className="mt-4 px-2 w-full gap-2.5">
            <Text className="font-bold mb-4">{image.author}</Text>
            <View className="flex-row gap-4">
              <Text>Width: {image.width}px</Text>
              <Text>Height: {image.height}px</Text>
            </View>
            <Text onPress={() => Linking.openURL(image.download_url)}>
              URL: {image.download_url}
            </Text>
          </View>
        </Pressable>
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
