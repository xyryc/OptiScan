import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  useColorScheme,
  PanResponder,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';

interface ResultBottomSheetProps {
  visible: boolean;
  barcodeType: string;
  scanData: string;
  onDismiss: () => void;
  onScanAgain: () => void;
}

const ResultBottomSheet: React.FC<ResultBottomSheetProps> = ({
  visible,
  barcodeType,
  scanData,
  onDismiss,
  onScanAgain,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const screenHeight = Dimensions.get('window').height;
  const sheetHeight = screenHeight * 0.50;
  
  // Add padding for safe area (home indicator on newer iPhones)
  const bottomPadding = Math.max(insets.bottom, 16) + 32;
  
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      showSheet();
    } else {
      hideSheet();
    }
  }, [visible]);
  
  const showSheet = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        mass: 1,
        stiffness: 180,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.4,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const hideSheet = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: sheetHeight,
        damping: 25,
        mass: 1,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldDismiss = gestureState.dy > 120 || gestureState.vy > 0.5;
        
        if (shouldDismiss) {
          onDismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            damping: 20,
            stiffness: 180,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  
  const formatBarcodeType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'qr': 'QR Code',
      'ean13': 'EAN-13',
      'upc_a': 'UPC-A',
      'upc_e': 'UPC-E',
      'code128': 'Code 128',
      'code39': 'Code 39',
      'code93': 'Code 93',
      'pdf417': 'PDF417',
      'datamatrix': 'Data Matrix',
      'aztec': 'Aztec',
      'itf14': 'ITF-14',
      'codabar': 'Codabar',
    };
    return typeMap[type.toLowerCase()] || type.toUpperCase();
  };
  
  const isURL = (text: string): boolean => {
    return text.startsWith('http://') || 
           text.startsWith('https://') ||
           /^([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(text);
  };
  
  const handleCopy = async () => {
    await Clipboard.setStringAsync(scanData);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied', 'Content copied to clipboard');
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: scanData,
        title: `Scanned ${formatBarcodeType(barcodeType)}`,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleOpenLink = async () => {
    let url = scanData;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Alert.alert('Invalid URL', 'Unable to open this link.');
    }
  };
  
  if (!visible) return null;
  
  const buttonBg = isDark 
    ? 'rgba(10, 132, 255, 0.2)' 
    : 'rgba(0, 122, 255, 0.15)';
  const iconColor = isDark ? '#0A84FF' : '#007AFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  
  return (
    <>
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <BlurView
          intensity={100}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurContainer}
        >
          <View style={styles.handleContainer}>
            <View 
              style={[
                styles.dragHandle,
                { 
                  backgroundColor: isDark 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(0, 0, 0, 0.2)' 
                }
              ]} 
            />
          </View>
          
          <ScrollView 
            style={styles.contentScroll}
            contentContainerStyle={{ paddingBottom: bottomPadding }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={[styles.title, { color: iconColor }]}>
              {formatBarcodeType(barcodeType)}
            </Text>
            
            <View style={styles.dataSection}>
              <Text style={[styles.dataLabel, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
                SCANNED CONTENT
              </Text>
              <ScrollView 
                style={[
                  styles.dataContainer,
                  { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
                ]}
                nestedScrollEnabled={true}
              >
                <Text 
                  style={[styles.dataText, { color: textColor }]}
                  selectable={true}
                >
                  {scanData}
                </Text>
              </ScrollView>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: buttonBg }]}
                onPress={handleCopy}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonIcon, { color: iconColor }]}>📋</Text>
                <Text style={[styles.buttonText, { color: textColor }]}>Copy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: buttonBg }]}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonIcon, { color: iconColor }]}>↗️</Text>
                <Text style={[styles.buttonText, { color: textColor }]}>Share</Text>
              </TouchableOpacity>
              
              {isURL(scanData) && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: buttonBg }]}
                  onPress={handleOpenLink}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.buttonIcon, { color: iconColor }]}>🌐</Text>
                  <Text style={[styles.buttonText, { color: textColor }]}>Open</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.scanAnotherButton,
                { backgroundColor: isDark ? '#0A84FF' : '#007AFF' }
              ]}
              onPress={onScanAgain}
              activeOpacity={0.8}
            >
              <Text style={styles.scanAnotherIcon}>📷</Text>
              <Text style={styles.scanAnotherText}>Scan Another</Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  blurContainer: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  dataSection: {
    marginBottom: 24,
  },
  dataLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.6,
    letterSpacing: 0.5,
  },
  dataContainer: {
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
  },
  dataText: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scanAnotherButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  scanAnotherIcon: {
    fontSize: 20,
  },
  scanAnotherText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ResultBottomSheet;
