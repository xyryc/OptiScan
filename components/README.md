# Components Directory

This directory will contain reusable React Native components for OptiScan.

## Planned Components

### UI Components
- **Button** - iOS-styled button with variants (primary, secondary, destructive)
- **Card** - Rounded card container with shadow
- **Input** - Text input with iOS styling
- **Switch** - iOS-styled toggle switch
- **BottomSheet** - Modal bottom sheet for scan results
- **ListItem** - Settings list item with chevron

### Feature Components
- **BarcodeScanner** - Camera view with scanning overlay
- **BarcodeGenerator** - Barcode/QR code generation and preview
- **ScanResult** - Display scan results with actions
- **HistoryItem** - Scan history list item

### Layout Components
- **Container** - Safe area wrapper with padding
- **Section** - Settings section with header
- **Divider** - Separator line

## Usage Example

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" onPress={handlePress}>
  Scan Barcode
</Button>
```
