import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-gray-50 dark:bg-black">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView className="flex-1">
        <View className="pt-6 px-6 pb-24">
          <Text className="text-3xl font-bold text-black dark:text-white mb-8">
            Settings
          </Text>

          {/* Appearance Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Appearance
            </Text>
            <View className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <Text className="text-base text-black dark:text-white">Dark Mode</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400">System</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scan Behavior Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Scan Behavior
            </Text>
            <View className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <Text className="text-base text-black dark:text-white">Auto-Save Scans</Text>
                <View className="w-12 h-7 bg-blue-500 rounded-full" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <Text className="text-base text-black dark:text-white">Haptic Feedback</Text>
                <View className="w-12 h-7 bg-blue-500 rounded-full" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4">
                <Text className="text-base text-black dark:text-white">Sound Alerts</Text>
                <View className="w-12 h-7 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Information Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Information
            </Text>
            <View className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <Text className="text-base text-black dark:text-white">Supported Symbologies</Text>
                <Text className="text-xl text-gray-400">›</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4">
                <Text className="text-base text-black dark:text-white">About OptiScan</Text>
                <Text className="text-xl text-gray-400">›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Data Management Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Data Management
            </Text>
            <View className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <Text className="text-base text-black dark:text-white">Export History</Text>
                <Text className="text-xl text-gray-400">›</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4">
                <Text className="text-base text-red-500">Clear Scan History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version */}
          <View className="items-center mt-8">
            <Text className="text-sm text-gray-500 dark:text-gray-500">
              OptiScan v1.0.0
            </Text>
            <Text className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Built with React Native & Expo
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
