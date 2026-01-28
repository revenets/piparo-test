import { BlurView } from 'expo-blur';
import { useSafeAreaPaddings } from 'hooks/use-safe-area-paddings.hook';
import { type FC } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenWrapperProps = ViewProps & {
  children?: React.ReactNode;
  edges?: Edge[];
};

export const ScreenWrapper: FC<ScreenWrapperProps> = ({
  children,
  edges,
  style: styleOverride,
  ...rest
}) => {
  const screenPaddings = useSafeAreaPaddings(edges);
  const { top } = useSafeAreaInsets();
  const combinedContainerStyle: StyleProp<ViewStyle> = [screenPaddings, styleOverride];

  return (
    <View className={styles.container} style={combinedContainerStyle} {...rest}>
      {!edges?.includes('top') && (
        <BlurView intensity={50} tint='extraLight' className="absolute top-0 z-10 w-full" style={{ height: top }} />
      )}
      {children}
    </View>
  );
};

const styles = {
  container: `flex-1 bg-gray-200`,
};
