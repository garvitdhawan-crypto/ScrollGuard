import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { SplashScreen } from './src/components';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <RootNavigator />
      )}
    </SafeAreaProvider>
  );
}

export default App;
