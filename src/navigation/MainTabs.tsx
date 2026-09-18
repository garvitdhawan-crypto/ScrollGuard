import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { GuardScreen } from '../screens/GuardScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { MainTabParamList } from './types';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeTabIcon = ({ focused }: { focused: boolean }) => (
  <Text style={[styles.icon, focused && { color: theme.colors.primary }]}>🏰</Text>
);

const GuardTabIcon = ({ focused }: { focused: boolean }) => (
  <Text style={[styles.icon, focused && { color: theme.colors.primary }]}>🛡️</Text>
);

const StatsTabIcon = ({ focused }: { focused: boolean }) => (
  <Text style={[styles.icon, focused && { color: theme.colors.primary }]}>⚡</Text>
);

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Fortress',
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tab.Screen
        name="Guard"
        component={GuardScreen}
        options={{
          tabBarLabel: 'Shield',
          tabBarIcon: GuardTabIcon,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Arena',
          tabBarIcon: StatsTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
});
