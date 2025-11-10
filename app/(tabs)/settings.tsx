import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type BarcodeFormat = 'qr' | 'pdf417' | 'code128' | 'ean13' | 'upc_a' | 'datamatrix' | 'aztec';

interface FormatInfo {
  value: BarcodeFormat;
  label: string;
  description: string;
  icon: string;
}

const SUPPORTED_FORMATS: FormatInfo[] = [
  {
    value: 'qr',
    label: 'QR Code',
    description: 'URLs, contact info, Wi-Fi, general data',
    icon: '⬛',
  },
  {
    value: 'pdf417',
    label: 'PDF417',
    description: "Driver's licenses, boarding passes, ID cards",
    icon: '▬',
  },
  {
    value: 'code128',
    label: 'Code 128',
    description: 'Shipping labels, product tracking',
    icon: '|||',
  },
  {
    value: 'ean13',
    label: 'EAN-13',
    description: 'Retail products (European/International)',
    icon: '|||',
  },
  {
    value: 'upc_a',
    label: 'UPC-A',
    description: 'Retail products (North America)',
    icon: '|||',
  },
  {
    value: 'datamatrix',
    label: 'Data Matrix',
    description: 'Small items, electronics, pharmaceuticals',
    icon: '▪',
  },
  {
    value: 'aztec',
    label: 'Aztec',
    description: 'Transportation tickets, event passes',
    icon: '◆',
  },
];

const DARK_MODE_KEY = '@optiscan_dark_mode';
const GITHUB_URL = 'https://github.com/yourusername/optiscan';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [forceDarkMode, setForceDarkMode] = useState(false);
  
  const version = Constants.expoConfig?.version || '1.0.0';
  
  useEffect(() => {
    loadDarkModePreference();
  }, []);
  
  const loadDarkModePreference = async () => {
    try {
      const value = await AsyncStorage.getItem(DARK_MODE_KEY);
      setForceDarkMode(value === 'dark');
    } catch (error) {
      console.error('Failed to load dark mode preference:', error);
    }
  };
  
  const handleDarkModeToggle = async (value: boolean) => {
    setForceDarkMode(value);
    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, value ? 'dark' : 'system');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Failed to save dark mode preference:', error);
    }
  };
  
  const handleGitHubPress = async () => {
    try {
      const canOpen = await Linking.canOpenURL(GITHUB_URL);
      if (canOpen) {
        await Linking.openURL(GITHUB_URL);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Alert.alert('Error', 'Unable to open GitHub link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.appName, { color: isDark ? '#0A84FF' : '#007AFF' }]}>
            OptiScan
          </Text>
          <Text style={[styles.versionText, { color: '#8E8E93' }]}>
            Version {version}
          </Text>
          <Text style={[styles.tagline, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
            Scan and generate barcodes with ease
          </Text>
        </View>
        
        {/* Supported Formats */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
            SUPPORTED FORMATS
          </Text>
          <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            {SUPPORTED_FORMATS.map((format, index) => (
              <View
                key={format.value}
                style={[
                  styles.formatItem,
                  index !== SUPPORTED_FORMATS.length - 1 && styles.formatItemBorder,
                  index !== SUPPORTED_FORMATS.length - 1 && {
                    borderBottomColor: isDark ? '#38383A' : '#C6C6C8',
                  },
                ]}
              >
                <View style={[styles.formatIcon, { backgroundColor: isDark ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 122, 255, 0.1)' }]}>
                  <Text style={styles.formatIconText}>{format.icon}</Text>
                </View>
                <View style={styles.formatContent}>
                  <Text style={[styles.formatLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {format.label}
                  </Text>
                  <Text style={[styles.formatDescription, { color: '#8E8E93' }]}>
                    {format.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* Dark Mode Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
            APPEARANCE
          </Text>
          <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Force Dark Mode
                </Text>
                <Text style={[styles.settingDescription, { color: '#8E8E93' }]}>
                  Override system appearance setting
                </Text>
              </View>
              <Switch
                value={forceDarkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{
                  false: isDark ? '#39393D' : '#E9E9EA',
                  true: isDark ? '#0A84FF' : '#007AFF',
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={isDark ? '#39393D' : '#E9E9EA'}
              />
            </View>
          </View>
        </View>
        
        {/* GitHub Link */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
            SOURCE CODE
          </Text>
          <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <TouchableOpacity
              style={styles.githubRow}
              onPress={handleGitHubPress}
              activeOpacity={0.7}
            >
              <View style={[styles.githubIcon, { backgroundColor: isDark ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 122, 255, 0.1)' }]}>
                <Text style={styles.githubIconText}>🌿</Text>
              </View>
              <View style={styles.githubContent}>
                <Text style={[styles.githubLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  View source on GitHub
                </Text>
                <Text style={[styles.githubDescription, { color: '#8E8E93' }]}>
                  Contribute or report issues
                </Text>
              </View>
              <Text style={[styles.chevron, { color: '#8E8E93' }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: '#8E8E93' }]}>
            Built with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  formatItemBorder: {
    borderBottomWidth: 0.5,
  },
  formatIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  formatIconText: {
    fontSize: 20,
  },
  formatContent: {
    flex: 1,
  },
  formatLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  formatDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  githubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  githubIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  githubIconText: {
    fontSize: 20,
  },
  githubContent: {
    flex: 1,
  },
  githubLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  githubDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
  },
});
