import { FC, startTransition, useMemo, useState } from 'react';

import { ScreenWrapper } from 'components/screen-wrapper';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageInfoModal } from 'components/image-info-modal';
import { GalleryModeSwitch } from 'components/gallery-mode-switch';

import { useFetchImagesList } from 'hooks/use-images-list.hook';
import { useImagesStore } from 'store/images-store';
import { ImageDto } from 'types/image-dto.type';

const GalleryScreen: FC = () => {
  const [isImageInfoModalVisible, setIsImageInfoModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageDto | null>(null);
  const [listColsNumber, setListColsNumber] = useState<number>(1);
  const { bottom } = useSafeAreaInsets();

  const { images } = useImagesStore();
  const { fetchMoreImages, isLoading, isLoadingMore } = useFetchImagesList();

  const { width: screenWidth } = useWindowDimensions();

  const itemWidth = useMemo<number>(() => {
    const totalSpacing = listColsNumber > 1 ? 10 * (listColsNumber - 1) : 0;

    return (screenWidth - 32 - totalSpacing) / listColsNumber;
  }, [listColsNumber, screenWidth]);

  const itemHeight = useMemo<number>(() => {
    if (listColsNumber === 1) {
      return (itemWidth * 9) / 16;
    } else {
      return itemWidth;
    }
  }, [itemWidth, listColsNumber]);

  const renderImageItem = ({ item }: ListRenderItemInfo<ImageDto>) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ width: itemWidth, height: itemHeight }}
        className="mb-2.5 overflow-hidden rounded-2xl"
        onPress={() => {
          setSelectedImage(item);
          setIsImageInfoModalVisible(true);
        }}>
        <Image
          source={{ uri: item.download_url }}
          style={StyleSheet.absoluteFill}
          cachePolicy={'memory-disk'}
          contentFit="cover"
        />
      </TouchableOpacity>
    );
  };

  const handleColsChange = (newValue: number) => {
    startTransition(() => {
      setListColsNumber(newValue);
    });
  };

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <GalleryModeSwitch
        value={listColsNumber}
        onChange={handleColsChange}
        containerClassName="absolute self-center z-10"
        style={{ bottom: bottom || 16 }}
      />
      <FlatList
        key={`flatlist-${listColsNumber}`}
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderImageItem}
        onEndReachedThreshold={listColsNumber === 1 ? 0.5 : 0.8}
        onEndReached={fetchMoreImages}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" /> : null}
        ListEmptyComponent={isLoading ? <ActivityIndicator size="small" /> : null}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center justify-center px-2 pt-5"
        numColumns={listColsNumber}
        columnWrapperStyle={
          listColsNumber > 1 ? { justifyContent: 'space-between', gap: 10 } : undefined
        }
      />
      <ImageInfoModal
        image={selectedImage}
        visible={isImageInfoModalVisible}
        onClose={() => setIsImageInfoModalVisible(false)}
      />
    </ScreenWrapper>
  );
};

export { GalleryScreen };
