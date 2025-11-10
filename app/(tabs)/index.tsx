import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Animated, Alert, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import ResultBottomSheet from '@/components/ResultBottomSheet';

export default function ScanScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [torch, setTorch] = useState(false);
  const [scanResult, setScanResult] = useState<{ type: string; data: string } | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  
  // Animation values
  const reticleScale = useRef(new Animated.Value(1)).current;
  const reticleOpacity = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    requestCameraPermission();
  }, []);
  
  useEffect(() => {
    if (isScanning && isCameraActive) {
      startReticleAnimation();
    }
  }, [isScanning, isCameraActive]);
  
  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );
  
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status === 'denied') {
      showPermissionAlert();
    }
  };
  
  const showPermissionAlert = () => {
    Alert.alert(
      'Camera Access Required',
      'OptiScan needs camera access to scan barcodes. Please enable it in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };
  
  const startReticleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(reticleScale, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(reticleOpacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(reticleScale, {
            toValue: 1.0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(reticleOpacity, {
            toValue: 1.0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  };
  
  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setScanResult({ type, data });
    setShowBottomSheet(true);
  };
  
  const handleDismissSheet = () => {
    setShowBottomSheet(false);
    setTimeout(() => {
      setIsScanning(true);
      setScanResult(null);
    }, 250);
  };
  
  const handleScanAgain = () => {
    handleDismissSheet();
  };
  
  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Requesting camera permission...
          </Text>
        </View>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={[styles.placeholderTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.placeholderMessage, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
            To scan barcodes, please allow camera access in Settings.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
            activeOpacity={0.8}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'pdf417',
              'code128',
              'ean13',
              'upc_a',
              'datamatrix',
              'aztec',
            ],
          }}
          onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
          enableTorch={torch}
        />
      )}
      
      {!showBottomSheet && (
        <>
          <TouchableOpacity
            style={styles.torchButton}
            onPress={() => setTorch(!torch)}
            activeOpacity={0.8}
          >
            <Text style={styles.torchIcon}>{torch ? '🔦' : '💡'}</Text>
          </TouchableOpacity>
          
          <Animated.View
            style={[
              styles.reticle,
              {
                transform: [{ scale: reticleScale }],
                opacity: reticleOpacity,
              },
            ]}
          />
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Position barcode within frame
            </Text>
          </View>
        </>
      )}
      
      {showBottomSheet && scanResult && (
        <View style={styles.dimOverlay} />
      )}
      
      {scanResult && (
        <ResultBottomSheet
          visible={showBottomSheet}
          barcodeType={scanResult.type}
          scanData={scanResult.data}
          onDismiss={handleDismissSheet}
          onScanAgain={handleScanAgain}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderMessage: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.6,
  },
  placeholderText: {
    fontSize: 17,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  torchButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  torchIcon: {
    fontSize: 24,
  },
  reticle: {
    position: 'absolute',
    width: 288,
    height: 288,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    top: '50%',
    marginTop: -144,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
