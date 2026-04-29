import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { Home, Newspaper, LayoutGrid, Compass } from 'lucide-react-native';
import { View } from 'react-native';

import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import { HapticTab } from '../components/haptic-tab';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.tabIconDefault,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: {
              backgroundColor: theme.card,
              borderTopWidth: 1,
              borderTopColor: theme.border,
              height: 80,
              paddingBottom: 20,
              paddingTop: 8,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 0.3,
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Ana Sayfa',
              tabBarIcon: ({ color, focused }) => (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: focused ? theme.primary + '15' : 'transparent',
                }}>
                  <Home size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="news"
            options={{
              title: 'Haberler',
              tabBarIcon: ({ color, focused }) => (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: focused ? theme.primary + '15' : 'transparent',
                }}>
                  <Newspaper size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="services"
            options={{
              title: 'Hizmetler',
              tabBarIcon: ({ color, focused }) => (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: focused ? theme.primary + '15' : 'transparent',
                }}>
                  <LayoutGrid size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="discover"
            options={{
              title: 'Keşfet',
              tabBarIcon: ({ color, focused }) => (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: focused ? theme.primary + '15' : 'transparent',
                }}>
                  <Compass size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
                </View>
              ),
            }}
          />
          <Tabs.Screen name="modal" options={{ href: null }} />
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
