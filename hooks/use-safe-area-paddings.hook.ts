import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

type Padding = 'paddingTop' | 'paddingLeft' | 'paddingRight' | 'paddingBottom';

type PaddingStyle = {
  [key in Padding]: number;
};

const useSafeAreaPaddings = (edges: readonly Edge[] = ['top', 'left', 'right', 'bottom']) => {
  const safeAreaInsets = useSafeAreaInsets();

  const edgeStyleMap: Record<Edge, Partial<PaddingStyle>> = {
    top: { paddingTop: safeAreaInsets.top || 0 },
    left: { paddingLeft: safeAreaInsets.left || 0 },
    right: { paddingRight: safeAreaInsets.right || 0 },
    bottom: { paddingBottom: safeAreaInsets.bottom || 0 },
  };

  return edges.reduce(
    (acc, edge) => {
      if (edgeStyleMap[edge]) {
        return { ...acc, ...edgeStyleMap[edge] };
      } else {
        return acc;
      }
    },
    {
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
  );
};

export { useSafeAreaPaddings };
