# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app on your iOS/Android device
- (Optional) Xcode for iOS simulator
- (Optional) Android Studio for Android emulator

### First Time Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device/simulator**
   - Scan the QR code with Expo Go (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web (limited functionality)

## Project Structure

```
OptiScan/
├── app/                      # Expo Router pages (file-based routing)
│   ├── (tabs)/              # Tab navigation group
│   │   ├── _layout.tsx      # Tab bar with blur effect
│   │   ├── index.tsx        # Scan tab (default)
│   │   ├── generate.tsx     # Generate tab
│   │   └── settings.tsx     # Settings tab
│   ├── _layout.tsx          # Root layout (imports global.css)
│   └── index.tsx            # Entry point (redirects to tabs)
│
├── components/              # Reusable components
│   ├── ui/                  # UI primitives (Button, Card, Input)
│   └── features/            # Feature components (Scanner, Generator)
│
├── constants/               # App constants
│   ├── Colors.ts            # iOS system colors
│   ├── Layout.ts            # Spacing, typography, shadows
│   └── index.ts             # Barrel export
│
├── assets/                  # Static assets
│   ├── images/
│   └── fonts/
│
├── global.css               # NativeWind global styles
├── tailwind.config.js       # TailwindCSS configuration
├── metro.config.js          # Metro bundler config (NativeWind)
├── babel.config.js          # Babel config (NativeWind + Reanimated)
└── app.json                 # Expo configuration
```

## Key Technologies

### Expo Router (File-based Navigation)
- **File = Route**: `app/settings.tsx` → `/settings`
- **Folders = Groups**: `app/(tabs)/` groups related screens
- **_layout.tsx**: Defines layout for child routes
- **index.tsx**: Default route in a folder

### NativeWind (TailwindCSS for React Native)
- Use `className` prop just like web
- Supports dark mode with `dark:` prefix
- Example: `className="bg-white dark:bg-black"`

### TypeScript
- Strict mode enabled
- Type safety for props and state
- Auto-completion in IDE

## Development Workflow

### Adding a New Screen

1. Create file in `app/` directory
   ```tsx
   // app/about.tsx
   export default function AboutScreen() {
     return <View>...</View>;
   }
   ```

2. Link to it using `expo-router`
   ```tsx
   import { Link } from 'expo-router';
   <Link href="/about">About</Link>
   ```

### Creating a Component

1. Create in `components/` directory
   ```tsx
   // components/ui/Button.tsx
   export function Button({ children, onPress }) {
     return (
       <TouchableOpacity onPress={onPress}>
         <Text>{children}</Text>
       </TouchableOpacity>
     );
   }
   ```

2. Import and use
   ```tsx
   import { Button } from '@/components/ui/Button';
   <Button onPress={handlePress}>Click me</Button>
   ```

### Styling with NativeWind

```tsx
// Light mode only
<View className="bg-white p-4 rounded-xl">

// Dark mode support
<View className="bg-white dark:bg-black p-4 rounded-xl">

// Responsive (not fully supported in RN)
<View className="p-4 md:p-8">

// Custom colors from tailwind.config.js
<View className="bg-systemBlue-light dark:bg-systemBlue-dark">
```

### Using iOS System Colors

```tsx
import { Colors, getColor } from '@/constants';
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';
const bgColor = getColor('systemBackground', isDark);
```

## Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Type check
npx tsc --noEmit

# Install new package (use expo install for native modules)
npx expo install package-name
```

## Debugging

### React Native Debugger
1. Press `j` in terminal to open debugger
2. Use Chrome DevTools for debugging
3. View console logs and network requests

### Expo Dev Tools
- Press `m` to open menu
- Press `r` to reload
- Press `d` to open developer menu on device

### Common Issues

**Metro bundler cache issues**
```bash
npm start -- --clear
```

**TypeScript errors**
```bash
npx tsc --noEmit
```

**Package conflicts**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Testing

### Manual Testing Checklist
- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] Test light mode
- [ ] Test dark mode
- [ ] Test with larger text sizes (accessibility)
- [ ] Test with VoiceOver/TalkBack

### Future: Automated Testing
- Jest for unit tests
- React Native Testing Library
- Detox for E2E tests

## Performance Tips

1. **Use React.memo for expensive components**
2. **Optimize images** - use WebP format
3. **Lazy load screens** - use `React.lazy()` if needed
4. **Profile with Flipper** - monitor performance
5. **Avoid inline functions** in render methods

## Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript types/interfaces
- Follow iOS naming conventions (camelCase)
- Keep components small and focused
- Extract reusable logic into custom hooks

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/scanner-implementation

# Commit changes
git add .
git commit -m "feat: implement barcode scanner"

# Push to remote
git push origin feature/scanner-implementation
```

### Commit Message Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/ios)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## Next Steps

1. **Implement Camera Scanner**
   - Install `expo-camera` or `react-native-vision-camera`
   - Request camera permissions
   - Integrate barcode detection

2. **Implement Barcode Generator**
   - Install barcode generation library
   - Create dynamic form
   - Add save/share functionality

3. **Add Settings Functionality**
   - Implement dark mode toggle
   - Add preferences storage (AsyncStorage)
   - Create About page

4. **Polish UI**
   - Add animations with Reanimated
   - Implement bottom sheet
   - Add haptic feedback

5. **Prepare for Release**
   - Add app icon and splash screen
   - Configure app.json for stores
   - Test on real devices
   - Build with EAS Build
