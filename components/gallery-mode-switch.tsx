import { StyleSheet, View, Pressable } from 'react-native';
import { GlassView, GlassContainer } from 'expo-glass-effect';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import { FC, useEffect, useRef } from 'react';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

const AnimatedGlassView = createAnimatedComponent(GlassView);

type GalleryModeSwitchProps = {
  value: number;
  onChange: (newValue: number) => void;
  style?: View['props']['style'];
  containerClassName?: string;
};

const GalleryModeSwitch: FC<GalleryModeSwitchProps> = ({
  value,
  onChange,
  style,
  containerClassName,
}) => {
  const progress = useSharedValue(value === 1 ? 0 : 1);
  const isFirstRenderRef = useRef(true);

  const ACTIVE_COLOR = '#192740';
  const INACTIVE_COLOR = '#ffffff';

  const indicatorAnimationStyle = useAnimatedStyle(() => {
    const tx = interpolate(progress.value, [0, 1], [10, 90]);

    return {
      transform: [{ translateX: tx }],
    };
  });

  const leftActiveOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  const leftInactiveOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  const rightActiveOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  const rightInactiveOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  const handlePress = (newValue: number) => {
    'worklet';

    const target = newValue === 1 ? 0 : 1;

    progress.value = withTiming(target, { duration: 200 }, () => {
      scheduleOnRN(onChange, newValue);
    });
  };

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    const target = value === 1 ? 0 : 1;
    progress.value = withTiming(target, { duration: 200 });
  }, [value, progress]);

  return (
    <Animated.View style={style} className={containerClassName}>
      <GlassContainer spacing={10} style={styles.containerStyle}>
        <AnimatedGlassView
          glassEffectStyle="regular"
          style={[styles.glass1, indicatorAnimationStyle]}
          isInteractive
        />
        <View className="flex-row ">
          <Pressable
            className="relative flex-1 items-center"
            onPress={() => scheduleOnUI(handlePress, 1)}>
            <View className="relative h-[24px] w-[24px]">
              <Animated.View className="absolute" style={leftActiveOpacityStyle}>
                <MaterialIcons name="view-stream" size={24} color={ACTIVE_COLOR} />
              </Animated.View>
              <Animated.View className="absolute" style={leftInactiveOpacityStyle}>
                <MaterialIcons name="view-stream" size={24} color={INACTIVE_COLOR} />
              </Animated.View>
            </View>
          </Pressable>
          <Pressable
            className="relative flex-1 items-center"
            onPress={() => scheduleOnUI(handlePress, 2)}>
            <View className="relative h-[24px] w-[24px]">
              <Animated.View className="absolute" style={rightActiveOpacityStyle}>
                <MaterialIcons name="view-module" size={24} color={ACTIVE_COLOR} />
              </Animated.View>
              <Animated.View className="absolute" style={rightInactiveOpacityStyle}>
                <MaterialIcons name="view-module" size={24} color={INACTIVE_COLOR} />
              </Animated.View>
            </View>
          </Pressable>
        </View>
      </GlassContainer>
    </Animated.View>
  );
};

export { GalleryModeSwitch };

const styles = StyleSheet.create({
  containerStyle: {
    width: 180,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#9e9e9eb3',
    borderRadius: 75,
    paddingHorizontal: 8,
  },
  glass1: {
    position: 'absolute',
    width: 80,
    height: 40,
    borderRadius: 30,
    zIndex: 2,
  },
});
