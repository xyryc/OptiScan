# OptiScan

An iOS-styled universal barcode scanner and generator mobile app built with React Native, Expo, and NativeWind.

## 🎯 Features

- **Universal Barcode Scanner** - Scan QR codes, EAN-13, UPC-A, Code 128, Data Matrix, PDF417, Aztec, and more
- **Multi-Format Generator** - Create barcodes and QR codes in any standard format
- **iOS Native Design** - System colors, SF Pro font, smooth spring animations
- **Dark Mode Support** - Automatic adaptation to system appearance
- **Bottom Tab Navigation** - Three main sections: Scan, Generate, Settings

## 🛠 Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **Expo Router** - File-based navigation
- **NativeWind** - TailwindCSS for React Native
- **TypeScript** - Type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd OptiScan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` or scan QR code with Expo Go
   - **Android**: Press `a` or scan QR code with Expo Go
   - **Web**: Press `w` (limited functionality)

## 📦 Android Release Script

Use the script to build signed Android release artifacts from `.env` values.

Required `.env` variables:

```env
ANDROID_KEYSTORE_PATH=./release.keystore
ANDROID_KEYSTORE_PASSWORD=your_store_password
ANDROID_KEY_ALIAS=optiscan
ANDROID_KEY_PASSWORD=your_key_password
```

If `ANDROID_KEY_PASSWORD` is empty, the script uses `ANDROID_KEYSTORE_PASSWORD`.
The release script reads `version` and `android.versionCode` from `app.config.json`, then applies them to `android/app/build.gradle` before building.

Build commands:

```bash
node scripts/release-android.js aab
node scripts/release-android.js apk
node scripts/release-android.js both
```

Or via npm scripts:

```bash
npm run release:android:aab
npm run release:android:apk
npm run release:android:both
```

The script automatically copies the keystore to `android/app/release.keystore` before signing, so it still works after `expo prebuild`.

## ✅ Verify Android Signing

After creating a release build, verify the signatures before uploading:

- **AAB**
  ```bash
  jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
  ```

- **APK**
  ```bash
  apksigner verify --verbose --print-certs android/app/build/outputs/apk/release/app-release.apk
  ```

## 📱 Project Structure

```
OptiScan/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab bar configuration
│   │   ├── index.tsx      # Scan tab
│   │   ├── generate.tsx   # Generate tab
│   │   └── settings.tsx   # Settings tab
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry redirect
├── components/            # Reusable components (to be added)
├── constants/             # App constants (to be added)
├── assets/                # Images, fonts, icons
├── global.css             # NativeWind global styles
├── tailwind.config.js     # TailwindCSS configuration
├── metro.config.js        # Metro bundler config
├── babel.config.js        # Babel configuration
└── app.config.json        # Expo configuration
```

## 🎨 Design System

### Colors (iOS System Colors)
- **Light Mode**: `#007AFF` (systemBlue), `#FFFFFF` (systemBackground)
- **Dark Mode**: `#0A84FF` (systemBlue), `#000000` (systemBackground)

### Typography
- **Font Family**: SF Pro (iOS system font)
- **Sizes**: 34pt (Large Title), 28pt (Title 1), 22pt (Title 2), 17pt (Body)

### Corner Radius
- **Cards**: 12pt
- **Buttons**: 20pt (fully rounded)
- **Bottom Sheet**: 16pt (top corners only)

### Animations
- **Tab Switch**: Fade + Scale (0.25s)
- **Bottom Sheet**: Spring (damping: 0.8, response: 0.3)
- **Button Press**: Scale (0.15s)

## 🚀 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Expo + TypeScript
- [x] NativeWind configuration
- [x] Expo Router with tab navigation
- [x] Basic tab screens (Scan, Generate, Settings)

### Phase 2: Scanner Implementation
- [ ] Camera permissions handling
- [ ] Barcode detection with `expo-camera` or `react-native-vision-camera`
- [ ] Result bottom sheet with blur effect
- [ ] Scan history storage
- [ ] Context-aware action buttons

### Phase 3: Generator Implementation
- [ ] Dynamic form based on barcode type
- [ ] Barcode generation library integration
- [ ] Preview with pinch-to-zoom
- [ ] Save to Photos functionality
- [ ] Share functionality

### Phase 4: Settings & Polish
- [ ] Dark mode toggle (System/Light/Dark)
- [ ] Scan behavior preferences
- [ ] Supported symbologies list
- [ ] About page with GitHub link
- [ ] Data export/clear functionality

### Phase 5: Advanced Features
- [ ] Batch scanning mode
- [ ] Custom QR code styling
- [ ] Scan analytics
- [ ] Widget support (iOS 14+)
- [ ] App Store submission

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React Native & Expo**
