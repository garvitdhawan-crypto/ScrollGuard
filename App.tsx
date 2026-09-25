import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { SplashScreen, ErrorBoundary } from './src/components';
import { NotificationService } from './src/services';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize Notification channels and schedule daily inactivity checkin
    NotificationService.init();
    NotificationService.scheduleDailyCheckin();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <ErrorBoundary fallbackTitle="ScrollGuard Recovered from Glitch">
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <RootNavigator />
        )}
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;
