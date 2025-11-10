import { Tabs } from 'expo-router';
import { useColorScheme, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

// Icon components - we'll use simple text for now, can be replaced with SF Symbols later
function ScanIcon({ color }: { color: string }) {
  return <Text style={{ fontSize: 28, color }}>📷</Text>;
}

function GenerateIcon({ color }: { color: string }) {
  return <Text style={{ fontSize: 28, color }}>⚡</Text>;
}

function SettingsIcon({ color }: { color: string }) {
  return <Text style={{ fontSize: 28, color }}>⚙️</Text>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // iOS system colors
  const activeColor = isDark ? '#0A84FF' : '#007AFF';
  const inactiveColor = isDark ? '#8E8E93' : '#8E8E93';
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : backgroundColor,
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Generate',
          tabBarIcon: ({ color }) => <GenerateIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
