/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // iOS System Colors
        systemBlue: {
          light: '#007AFF',
          dark: '#0A84FF',
        },
        systemGreen: {
          light: '#34C759',
          dark: '#30D158',
        },
        systemRed: {
          light: '#FF3B30',
          dark: '#FF453A',
        },
        systemOrange: {
          light: '#FF9500',
          dark: '#FF9F0A',
        },
        systemGray: {
          light: '#8E8E93',
          dark: '#8E8E93',
        },
        systemGray6: {
          light: '#F2F2F7',
          dark: '#1C1C1E',
        },
      },
      fontFamily: {
        // SF Pro will be handled by iOS system fonts
        'sf-regular': ['System'],
        'sf-medium': ['System'],
        'sf-bold': ['System'],
      },
      borderRadius: {
        'ios-card': '12px',
        'ios-button': '20px',
        'ios-sheet': '16px',
      },
      spacing: {
        'safe-top': '44px',
        'safe-bottom': '34px',
      },
    },
  },
  plugins: [],
}
