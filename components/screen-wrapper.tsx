import { useSafeAreaPaddings } from 'hooks/use-safe-area-paddings.hook';
import { type FC } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { Edge } from 'react-native-safe-area-context';

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
  const combinedContainerStyle: StyleProp<ViewStyle> = [screenPaddings, styleOverride];

  return (
    <View className={styles.container} style={combinedContainerStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = {
  container: `flex-1 bg-white`,
};
