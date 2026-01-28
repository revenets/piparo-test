import { FC, startTransition, useCallback, useMemo, useState } from 'react';

import { ScreenWrapper } from 'components/screen-wrapper';
import {
  ActivityIndicator,
  GestureResponderEvent,
  ListRenderItemInfo,
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

import { ImageInfoModal } from 'components/image-info-modal';
import { GalleryModeSwitch } from 'components/gallery-mode-switch';
import { GalleryImageItem, MIN_ITEM_HEIGHT } from 'components/gallery-image-item';
import { GalleryGridItem } from 'components/gallery-grid-item';

import { useFetchImagesList } from 'hooks/use-images-list.hook';
import { useImagesStore } from 'store/images-store';

const GalleryScreen: FC = () => {
  const [isImageInfoModalVisible, setIsImageInfoModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [listColsNumber, setListColsNumber] = useState<number>(1);
  const { bottom, top } = useSafeAreaInsets();

  const y = useSharedValue(0);

  const { imageIds, hideImage } = useImagesStore();
  const { fetchMoreImages, isLoading, isLoadingMore } = useFetchImagesList();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const itemWidth = useMemo<number>(() => {
    const totalSpacing = listColsNumber > 1 ? 10 * (listColsNumber - 1) : 0;

    return (screenWidth - 32 - totalSpacing) / listColsNumber;
  }, [listColsNumber, screenWidth]);

  const renderImageItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => {
      const handleOnPress = async (e: GestureResponderEvent) => {
        e.stopPropagation();
        setSelectedImage(item);
        setIsImageInfoModalVisible(true);
      };

      const handleHideImage = (e: GestureResponderEvent) => {
        e.stopPropagation();
        hideImage(item);
      };

      if (listColsNumber === 1) {
        return (
          <GalleryImageItem
            index={index}
            item={item}
            onPress={handleOnPress}
            onHide={handleHideImage}
            y={y}
          />
        );
      }

      return (
        <GalleryGridItem
          item={item}
          itemSize={itemWidth}
          onPress={handleOnPress}
          onHide={handleHideImage}
        />
      );
    },
    [hideImage, itemWidth, listColsNumber, y],
  );

  const onListScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      y.value = event.contentOffset.y;
    },
  });

  const handleColsChange = (newValue: number) => {
    startTransition(() => {
      setListColsNumber(newValue);
    });
  };

  return (
    <ScreenWrapper edges={['left', 'right']}>
      <GalleryModeSwitch
        value={listColsNumber}
        onChange={handleColsChange}
        containerClassName="absolute self-center z-10"
        style={{ bottom: bottom || 16 }}
      />
      <View className="absolute left-4 w-screen rounded-t-3xl" style={{ top: top + 8 }}>
        <GlassView glassEffectStyle="regular" style={styles.glass}>
          {Platform.OS === 'android' && (
            <View style={StyleSheet.absoluteFill} className="z-2 overflow-hidden rounded-3xl">
              <BlurView intensity={80} tint="extraLight" style={StyleSheet.absoluteFill} />
            </View>
          )}
          <Text className="text-2xl font-bold" style={{ color: PlatformColor('labelColor') }}>
            Image Gallery
          </Text>
        </GlassView>
      </View>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <Animated.FlatList
          key={`${listColsNumber}-list`}
          data={imageIds}
          keyExtractor={(item) => item}
          renderItem={renderImageItem}
          onEndReachedThreshold={listColsNumber === 1 ? 0.5 : 0.8}
          onEndReached={fetchMoreImages}
          ListFooterComponent={
            isLoadingMore && !isLoading ? <ActivityIndicator size="small" /> : null
          }
          numColumns={listColsNumber}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="items-center justify-center px-2"
          contentContainerStyle={{
            paddingBottom: screenHeight * 0.35,
            paddingTop: top + MIN_ITEM_HEIGHT - 24,
          }}
          columnWrapperClassName={listColsNumber > 1 ? 'justify-between gap-4' : undefined}
          onScroll={onListScroll}
          scrollEventThrottle={16}
          snapToInterval={screenHeight * 0.35}
          decelerationRate={'fast'}
        />
      )}
      <ImageInfoModal
        imageId={selectedImage}
        visible={isImageInfoModalVisible}
        onClose={() => setIsImageInfoModalVisible(false)}
      />
    </ScreenWrapper>
  );
};

export { GalleryScreen };

const styles = StyleSheet.create({
  glass: {
    position: 'absolute',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    height: 50,
    borderRadius: 30,
    zIndex: 2,
  },
});
