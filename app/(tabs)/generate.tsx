import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
  ActionSheetIOS,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';

type BarcodeFormat = 'qr' | 'code128' | 'ean13' | 'upc_a' | 'datamatrix' | 'aztec';

const FORMATS: { value: BarcodeFormat; label: string }[] = [
  { value: 'qr', label: 'QR Code' },
  { value: 'code128', label: 'Code 128' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'upc_a', label: 'UPC-A' },
  { value: 'datamatrix', label: 'Data Matrix' },
  { value: 'aztec', label: 'Aztec' },
];

export default function GenerateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>('qr');
  const [inputData, setInputData] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [debouncedData, setDebouncedData] = useState('');
  
  const viewShotRef = useRef<ViewShot>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(inputData);
      validateInput(selectedFormat, inputData);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputData, selectedFormat]);
  
  const validateInput = (format: BarcodeFormat, data: string) => {
    if (!data) {
      setValidationError(null);
      return;
    }
    
    switch (format) {
      case 'ean13':
        if (!/^\d{13}$/.test(data)) {
          setValidationError('EAN-13 requires exactly 13 digits');
        } else {
          setValidationError(null);
        }
        break;
      case 'upc_a':
        if (!/^\d{12}$/.test(data)) {
          setValidationError('UPC-A requires exactly 12 digits');
        } else {
          setValidationError(null);
        }
        break;
      case 'code128':
        if (data.length > 80) {
          setValidationError('Code 128 maximum length is 80 characters');
        } else {
          setValidationError(null);
        }
        break;
      default:
        setValidationError(null);
    }
  };
  
  const getMaxLength = (format: BarcodeFormat): number => {
    switch (format) {
      case 'ean13': return 13;
      case 'upc_a': return 12;
      case 'code128': return 80;
      case 'qr': return 4296;
      case 'datamatrix': return 2335;
      case 'aztec': return 3832;
      default: return 1000;
    }
  };
  
  const showFormatPicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...FORMATS.map(f => f.label)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSelectedFormat(FORMATS[buttonIndex - 1].value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      );
    } else {
      Alert.alert(
        'Select Format',
        '',
        FORMATS.map(f => ({
          text: f.label,
          onPress: () => {
            setSelectedFormat(f.value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }))
      );
    }
  };
  
  const handleSave = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await Share.share({
          url: uri,
          message: `Generated ${FORMATS.find(f => f.value === selectedFormat)?.label} barcode`,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Saved', 'Use the Share sheet to save the image to your device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare barcode image');
    }
  };
  
  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await Share.share({
          url: uri,
          message: `Generated ${FORMATS.find(f => f.value === selectedFormat)?.label} barcode`,
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Reset Generator',
      'This will clear all data and reset to defaults.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setInputData('');
            setSelectedFormat('qr');
            setForegroundColor('#000000');
            setBackgroundColor('#FFFFFF');
            setValidationError(null);
          },
        },
      ]
    );
  };
  
  const hasLowContrast = () => {
    return (
      (foregroundColor === '#000000' && backgroundColor === '#000000') ||
      (foregroundColor === '#FFFFFF' && backgroundColor === '#FFFFFF')
    );
  };
  
  const canGenerate = debouncedData.length > 0 && !validationError;
  
  const formatLabel = FORMATS.find(f => f.value === selectedFormat)?.label || 'QR Code';
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Generate
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
            Create barcodes and QR codes
          </Text>
          
          {/* Format Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
              FORMAT
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
              onPress={showFormatPicker}
              activeOpacity={0.7}
            >
              <Text style={[styles.pickerText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {formatLabel}
              </Text>
              <Text style={[styles.chevron, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>›</Text>
            </TouchableOpacity>
          </View>
          
          {/* Data Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
              CONTENT
            </Text>
            <View style={[styles.inputCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
              <TextInput
                style={[styles.textInput, { color: isDark ? '#FFFFFF' : '#000000' }]}
                placeholder="Enter text or URL to encode..."
                placeholderTextColor="#8E8E93"
                value={inputData}
                onChangeText={setInputData}
                multiline
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={getMaxLength(selectedFormat)}
              />
              <View style={styles.counterContainer}>
                <Text style={[styles.counterText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                  {inputData.length} / {getMaxLength(selectedFormat)}
                </Text>
              </View>
              {validationError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{validationError}</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
              COLORS
            </Text>
            <View style={styles.colorGrid}>
              <View style={styles.colorRow}>
                <Text style={[styles.colorRowLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Foreground
                </Text>
                <View style={styles.colorButtons}>
                  <ColorButton
                    color="#000000"
                    label="Black"
                    selected={foregroundColor === '#000000'}
                    onPress={() => setForegroundColor('#000000')}
                    isDark={isDark}
                  />
                  <ColorButton
                    color="#FFFFFF"
                    label="White"
                    selected={foregroundColor === '#FFFFFF'}
                    onPress={() => setForegroundColor('#FFFFFF')}
                    isDark={isDark}
                  />
                </View>
              </View>
              <View style={styles.colorRow}>
                <Text style={[styles.colorRowLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Background
                </Text>
                <View style={styles.colorButtons}>
                  <ColorButton
                    color="#FFFFFF"
                    label="White"
                    selected={backgroundColor === '#FFFFFF'}
                    onPress={() => setBackgroundColor('#FFFFFF')}
                    isDark={isDark}
                  />
                  <ColorButton
                    color="#000000"
                    label="Black"
                    selected={backgroundColor === '#000000'}
                    onPress={() => setBackgroundColor('#000000')}
                    isDark={isDark}
                  />
                </View>
              </View>
            </View>
            {hasLowContrast() && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                  Low contrast may make barcode difficult to scan
                </Text>
              </View>
            )}
          </View>
          
          {/* Live Preview */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
              PREVIEW
            </Text>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
              <View style={[styles.previewContainer, { backgroundColor }]}>
                {canGenerate ? (
                  <QRCode
                    value={debouncedData}
                    size={250}
                    color={foregroundColor}
                    backgroundColor={backgroundColor}
                  />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Text style={styles.placeholderIcon}>📱</Text>
                    <Text style={[styles.placeholderText, { color: foregroundColor }]}>
                      {validationError || 'Enter data to generate'}
                    </Text>
                  </View>
                )}
              </View>
            </ViewShot>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? '#0A84FF' : '#007AFF' },
                !canGenerate && styles.actionButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!canGenerate}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>💾</Text>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? '#0A84FF' : '#007AFF' },
                !canGenerate && styles.actionButtonDisabled,
              ]}
              onPress={handleShare}
              disabled={!canGenerate}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>↗️</Text>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.actionButtonSecondary,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' },
              ]}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>↻</Text>
              <Text style={[styles.buttonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ColorButtonProps {
  color: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, label, selected, onPress, isDark }) => {
  return (
    <TouchableOpacity
      style={[
        styles.colorButton,
        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
        selected && styles.colorButtonSelected,
        selected && { borderColor: isDark ? '#0A84FF' : '#007AFF' },
      ]}
      onPress={() => {
        onPress();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.colorSwatch,
          { backgroundColor: color },
          color === '#FFFFFF' && styles.colorSwatchBorder,
          color === '#FFFFFF' && { borderColor: isDark ? '#3C3C43' : '#C6C6C8' },
        ]}
      />
      <Text style={[styles.colorLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
        {label}
      </Text>
      {selected && (
        <View style={styles.checkmark}>
          <Text style={[styles.checkmarkIcon, { color: isDark ? '#0A84FF' : '#007AFF' }]}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    opacity: 0.6,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  pickerText: {
    fontSize: 17,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 24,
  },
  inputCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    fontSize: 17,
    lineHeight: 24,
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  counterText: {
    fontSize: 13,
    opacity: 0.6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
  },
  colorGrid: {
    gap: 12,
  },
  colorRow: {
    gap: 8,
  },
  colorRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  colorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  colorSwatchBorder: {
    borderWidth: 1,
  },
  colorLabel: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 8,
    gap: 8,
  },
  warningIcon: {
    fontSize: 16,
  },
  warningText: {
    fontSize: 13,
    color: '#FF9500',
    flex: 1,
  },
  previewContainer: {
    height: 300,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  placeholderIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonSecondary: {
    // backgroundColor set inline
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
