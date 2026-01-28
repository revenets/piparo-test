import { StatusBar } from 'expo-status-bar';

import { GalleryScreen } from 'screens/gallery';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <GalleryScreen />
      <StatusBar style="auto" translucent />
    </SafeAreaProvider>
  );
}
