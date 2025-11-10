/**
 * iOS System Colors
 * These colors follow Apple's Human Interface Guidelines
 * and automatically adapt to light/dark mode
 */

export const Colors = {
  light: {
    // System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemRed: '#FF3B30',
    systemOrange: '#FF9500',
    systemYellow: '#FFCC00',
    systemPink: '#FF2D55',
    systemPurple: '#AF52DE',
    systemTeal: '#5AC8FA',
    systemIndigo: '#5856D6',
    
    // Backgrounds
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',
    
    // Labels
    label: '#000000',
    secondaryLabel: 'rgba(60, 60, 67, 0.6)',
    tertiaryLabel: 'rgba(60, 60, 67, 0.3)',
    quaternaryLabel: 'rgba(60, 60, 67, 0.18)',
    
    // Fills
    systemFill: 'rgba(120, 120, 128, 0.2)',
    secondarySystemFill: 'rgba(120, 120, 128, 0.16)',
    tertiarySystemFill: 'rgba(118, 118, 128, 0.12)',
    quaternarySystemFill: 'rgba(116, 116, 128, 0.08)',
    
    // Separators
    separator: 'rgba(60, 60, 67, 0.29)',
    opaqueSeparator: '#C6C6C8',
    
    // Gray Palette
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
  },
  
  dark: {
    // System Colors (brighter in dark mode)
    systemBlue: '#0A84FF',
    systemGreen: '#30D158',
    systemRed: '#FF453A',
    systemOrange: '#FF9F0A',
    systemYellow: '#FFD60A',
    systemPink: '#FF375F',
    systemPurple: '#BF5AF2',
    systemTeal: '#64D2FF',
    systemIndigo: '#5E5CE6',
    
    // Backgrounds
    systemBackground: '#000000',
    secondarySystemBackground: '#1C1C1E',
    tertiarySystemBackground: '#2C2C2E',
    
    // Labels
    label: '#FFFFFF',
    secondaryLabel: 'rgba(235, 235, 245, 0.6)',
    tertiaryLabel: 'rgba(235, 235, 245, 0.3)',
    quaternaryLabel: 'rgba(235, 235, 245, 0.18)',
    
    // Fills
    systemFill: 'rgba(120, 120, 128, 0.36)',
    secondarySystemFill: 'rgba(120, 120, 128, 0.32)',
    tertiarySystemFill: 'rgba(118, 118, 128, 0.24)',
    quaternarySystemFill: 'rgba(118, 118, 128, 0.18)',
    
    // Separators
    separator: 'rgba(84, 84, 88, 0.65)',
    opaqueSeparator: '#38383A',
    
    // Gray Palette
    systemGray: '#8E8E93',
    systemGray2: '#636366',
    systemGray3: '#48484A',
    systemGray4: '#3A3A3C',
    systemGray5: '#2C2C2E',
    systemGray6: '#1C1C1E',
  },
};

/**
 * Helper function to get color based on color scheme
 */
export function getColor(colorName: keyof typeof Colors.light, isDark: boolean) {
  return isDark ? Colors.dark[colorName] : Colors.light[colorName];
}
