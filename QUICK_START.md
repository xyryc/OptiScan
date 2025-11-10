# OptiScan - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open on Your Device
- **iOS**: Open Camera app and scan the QR code
- **Android**: Open Expo Go app and scan the QR code
- **Simulator**: Press `i` for iOS or `a` for Android

## 📱 What You'll See

The app opens with **3 tabs** at the bottom:

### 📷 Scan Tab (Default)
- Camera placeholder with scanning reticle
- "Position barcode within frame" instruction
- Ready for camera implementation

### ⚡ Generate Tab
- Format picker (QR Code, Code 128, etc.)
- Content input field
- Generate button
- Ready for barcode generation

### ⚙️ Settings Tab
- Appearance settings (Dark Mode)
- Scan behavior preferences
- Information links
- Data management options

## 🎨 Features Already Working

✅ **Bottom Tab Navigation** - Smooth transitions between tabs  
✅ **iOS-Style Blur** - Translucent tab bar with blur effect  
✅ **Dark Mode** - Automatic switching based on system settings  
✅ **Safe Areas** - Proper handling of notch and home indicator  
✅ **iOS Design** - System colors, typography, and spacing  

## 🔧 Development Commands

```bash
# Start with cache cleared
npm start -- --clear

# Open iOS simulator
npm run ios

# Open Android emulator
npm run android

# Open in web browser
npm run web

# Type check
npx tsc --noEmit
```

## 🎯 Next Steps for Development

1. **Implement Camera Scanner**
   - Install: `npx expo install expo-camera`
   - Add camera permissions to `app.json`
   - Replace placeholder in `app/(tabs)/index.tsx`

2. **Implement Barcode Generator**
   - Install barcode library
   - Create form in `app/(tabs)/generate.tsx`
   - Add generation logic

3. **Add Settings Functionality**
   - Implement dark mode toggle
   - Add AsyncStorage for preferences
   - Create About page

## 📚 Documentation

- **[README.md](./README.md)** - Project overview and features
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Detailed development guide
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design system reference
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project status

## 🎨 Design System Quick Reference

### Colors
```tsx
className="bg-white dark:bg-black"
className="text-blue-500 dark:text-blue-400"
```

### Typography
```tsx
className="text-3xl font-bold"  // Title
className="text-base"           // Body
className="text-sm"             // Caption
```

### Spacing
```tsx
className="p-4"   // Padding 16pt
className="mb-6"  // Margin 24pt
className="gap-4" // Gap 16pt
```

### Border Radius
```tsx
className="rounded-xl"    // Cards (12pt)
className="rounded-full"  // Buttons (fully rounded)
```

## 💡 Pro Tips

1. **Test Dark Mode**: Toggle in iOS Settings → Display & Brightness
2. **Hot Reload**: Press `r` in terminal to reload the app
3. **Debug Menu**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
4. **Clear Cache**: If you see weird errors, run `npm start -- --clear`
5. **Use Constants**: Import colors and spacing from `@/constants`

## 🐛 Troubleshooting

### Server won't start
```bash
# Clear cache and restart
npm start -- --clear
```

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit
```

### Package conflicts
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Metro bundler issues
```bash
# Kill all node processes
killall node
npm start
```

## 📱 Testing Checklist

Before implementing new features, verify:
- [ ] App runs on iOS
- [ ] App runs on Android
- [ ] Light mode looks correct
- [ ] Dark mode looks correct
- [ ] Tab navigation works
- [ ] No TypeScript errors
- [ ] No console warnings

## 🎉 You're Ready!

The project is fully set up and ready for feature development. Start with implementing the camera scanner or barcode generator.

**Happy coding! 🚀**

---

**Need Help?**
- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed guides
- Review [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for styling patterns
- See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for complete status

**Current Status**: ✅ Foundation Complete - Ready for Features
