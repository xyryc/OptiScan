# OptiScan Design System Quick Reference

## 🎨 Colors

### Using with NativeWind
```tsx
// Background
className="bg-white dark:bg-black"

// Text
className="text-black dark:text-white"
className="text-gray-600 dark:text-gray-400"

// Accent
className="bg-blue-500 dark:bg-blue-400"
className="text-blue-500 dark:text-blue-400"
```

### Using with Constants
```tsx
import { Colors, getColor } from '@/constants';
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

// Get color
const bgColor = getColor('systemBackground', isDark);
const textColor = getColor('label', isDark);
const accentColor = getColor('systemBlue', isDark);
```

### Color Palette

| Color | Light | Dark |
|-------|-------|------|
| **systemBlue** | #007AFF | #0A84FF |
| **systemGreen** | #34C759 | #30D158 |
| **systemRed** | #FF3B30 | #FF453A |
| **systemOrange** | #FF9500 | #FF9F0A |
| **systemBackground** | #FFFFFF | #000000 |
| **secondarySystemBackground** | #F2F2F7 | #1C1C1E |
| **label** | #000000 | #FFFFFF |
| **secondaryLabel** | rgba(60,60,67,0.6) | rgba(235,235,245,0.6) |

## 📝 Typography

### Using with NativeWind
```tsx
// Headings
className="text-3xl font-bold"  // Title 1
className="text-2xl font-bold"  // Title 2
className="text-xl font-semibold" // Title 3

// Body
className="text-base"           // Body (17pt)
className="text-sm"             // Subheadline (15pt)
className="text-xs"             // Footnote (13pt)
```

### Using with Constants
```tsx
import { Typography } from '@/constants';

<Text style={Typography.title1}>Heading</Text>
<Text style={Typography.body}>Body text</Text>
<Text style={Typography.footnote}>Small text</Text>
```

### Typography Scale

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| **Large Title** | 34pt | Bold | Page titles |
| **Title 1** | 28pt | Bold | Section headers |
| **Title 2** | 22pt | Bold | Card headers |
| **Title 3** | 20pt | Semibold | Subsections |
| **Headline** | 17pt | Semibold | List items |
| **Body** | 17pt | Regular | Main content |
| **Callout** | 16pt | Regular | Secondary |
| **Subheadline** | 15pt | Regular | Captions |
| **Footnote** | 13pt | Regular | Helper text |
| **Caption** | 12pt | Regular | Fine print |

## 📏 Spacing

### Using with NativeWind
```tsx
// Padding
className="p-4"   // 16pt
className="p-6"   // 24pt
className="p-8"   // 32pt

// Margin
className="mb-2"  // 8pt
className="mb-4"  // 16pt
className="mb-6"  // 24pt

// Gap
className="gap-4" // 16pt between items
```

### Using with Constants
```tsx
import { Spacing } from '@/constants';

<View style={{ padding: Spacing.md }}>
<View style={{ marginBottom: Spacing.lg }}>
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| **xs** | 4pt | Tight spacing |
| **sm** | 8pt | Related elements |
| **md** | 16pt | Between sections |
| **lg** | 24pt | Major sections |
| **xl** | 32pt | Screen padding |
| **xxl** | 48pt | Large gaps |

## 🔲 Border Radius

### Using with NativeWind
```tsx
className="rounded-xl"      // 12pt (cards)
className="rounded-full"    // Fully rounded (buttons)
className="rounded-2xl"     // 16pt (sheets)
```

### Using with Constants
```tsx
import { BorderRadius } from '@/constants';

<View style={{ borderRadius: BorderRadius.card }}>
<TouchableOpacity style={{ borderRadius: BorderRadius.button }}>
```

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| **small** | 8pt | Small elements |
| **card** | 12pt | Cards, containers |
| **button** | 20pt | Primary buttons |
| **sheet** | 16pt | Bottom sheets |
| **full** | 9999pt | Circular elements |

## 🌑 Shadows

### Using with Constants
```tsx
import { Shadow } from '@/constants';

<View style={Shadow.level1}>  // Subtle
<View style={Shadow.level2}>  // Medium
<View style={Shadow.level3}>  // Strong
```

### Shadow Levels

| Level | Offset | Opacity | Blur | Usage |
|-------|--------|---------|------|-------|
| **1** | 0, 2 | 0.05 | 8pt | Cards, buttons |
| **2** | 0, 4 | 0.10 | 16pt | Modals, sheets |
| **3** | 0, 8 | 0.15 | 24pt | Floating elements |

## 🎭 Common Patterns

### Card Component
```tsx
<View className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4">
  <Text className="text-lg font-semibold text-black dark:text-white mb-2">
    Title
  </Text>
  <Text className="text-base text-gray-600 dark:text-gray-400">
    Description
  </Text>
</View>
```

### Primary Button
```tsx
<TouchableOpacity 
  className="bg-blue-500 rounded-full py-4 px-8 items-center"
  activeOpacity={0.8}
>
  <Text className="text-white text-lg font-semibold">
    Button Text
  </Text>
</TouchableOpacity>
```

### List Item (Settings)
```tsx
<TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
  <Text className="text-base text-black dark:text-white">
    Setting Name
  </Text>
  <Text className="text-xl text-gray-400">›</Text>
</TouchableOpacity>
```

### Section Header
```tsx
<Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
  Section Title
</Text>
```

### Input Field
```tsx
<View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
    Label
  </Text>
  <TextInput
    className="bg-white dark:bg-gray-900 rounded-lg p-4 text-black dark:text-white"
    placeholder="Enter text..."
    placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
  />
</View>
```

## 🎬 Animations

### Using with Reanimated
```tsx
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

// Spring animation
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(scale.value) }],
}));

// Timing animation
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(opacity.value, { duration: 250 }),
}));
```

### Animation Constants
```tsx
import { Animation } from '@/constants';

// Spring config
withSpring(value, {
  damping: Animation.spring.damping,    // 0.8
  stiffness: Animation.spring.stiffness, // 100
  mass: Animation.spring.mass,           // 0.3
});

// Timing durations
withTiming(value, { 
  duration: Animation.timing.fast    // 150ms
  duration: Animation.timing.normal  // 250ms
  duration: Animation.timing.slow    // 350ms
});
```

## 🔍 Accessibility

### Dynamic Type Support
```tsx
<Text 
  className="text-base"
  allowFontScaling={true}
  maxFontSizeMultiplier={2}
>
  Accessible text
</Text>
```

### VoiceOver Labels
```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Scan barcode"
  accessibilityHint="Opens camera to scan barcodes"
  accessibilityRole="button"
>
  <Text>Scan</Text>
</TouchableOpacity>
```

## 📱 Safe Areas

### Using Safe Area Context
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1 bg-white dark:bg-black">
  {/* Content */}
</SafeAreaView>
```

### Manual Safe Area Padding
```tsx
// Top safe area (status bar)
className="pt-safe-top"  // 44pt

// Bottom safe area (home indicator)
className="pb-safe-bottom"  // 34pt
```

## 🎨 Dark Mode

### Detecting Color Scheme
```tsx
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';
```

### Conditional Styling
```tsx
// With NativeWind
className="bg-white dark:bg-black"

// With inline styles
style={{
  backgroundColor: isDark ? '#000000' : '#FFFFFF',
}}
```

## 📦 Import Shortcuts

```tsx
// All constants
import { Colors, Spacing, Typography, BorderRadius, Shadow, Animation } from '@/constants';

// Specific utilities
import { getColor } from '@/constants';

// React Native
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';

// Safe Area
import { SafeAreaView } from 'react-native-safe-area-context';

// Navigation
import { Link, useRouter } from 'expo-router';

// Blur
import { BlurView } from 'expo-blur';
```

---

**Quick Tip**: Always test your UI in both light and dark modes!
