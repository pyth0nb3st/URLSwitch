# URL Switch

<div align="center">

![URL Switch Logo](icons/icon128.png)

A powerful browser extension for bidirectional URL switching and redirection between related websites.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)](https://developer.chrome.com/docs/extensions/)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Documentation](#documentation) • [Contributing](#contributing) • [License](#license)

</div>

## 🚀 Features

- **Bidirectional URL Conversion**: Seamlessly switch between related websites (e.g., github.com ↔ github.dev)
- **Powerful Rule Management**: Create, edit, and organize URL conversion rules
- **Group Organization**: Rules can be organized into logical groups (GitHub, StackOverflow, etc.)
- **Flexible Control**: Global extension toggle and per-rule group enabling/disabling
- **Auto-redirect Mode**: Automatically redirect to the target site based on your rules
- **Import/Export**: Easily backup and share your rule configurations
- **Multilingual Support**: Full interface available in English and Chinese (中文)

## 📥 Installation

### From Chrome Web Store (Coming Soon)

*URL Switch will be available in the Chrome Web Store soon.*

### Manual Installation (Developer Mode)

1. **Clone this repository**
   ```bash
   git clone https://github.com/pyth0nb3st/URLSwitch.git
   cd URLSwitch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `dist` directory from this project

## 💡 Usage

### Basic Usage

1. Navigate to any website
2. Click the URL Switch icon in your browser toolbar
3. Select from available redirects for the current page
4. Toggle "Auto Redirect" for automatic switching

### Options Page

Access the options page by:
- Right-clicking the extension icon and selecting "Options"
- Clicking "Settings" in the extension popup

In the options page, you can:
- Create and manage rule groups
- Add, edit or delete URL conversion rules
- Configure global settings
- Import/export your rules

## 📚 Documentation

### URL Pattern Format

URL Switch uses regular expressions for matching and transforming URLs:

- **From Pattern**: The regex pattern to match source URLs
- **To Pattern**: The transformation pattern with capture group references

Example:
- From Pattern: `^https?://github\.com/([^/]+/[^/]+)(?:/.*)?$`
- To Pattern: `https://github.dev/$1`

This converts `https://github.com/username/repo` to `https://github.dev/username/repo`

### Project Structure

- `/src` - Source code
  - `/background` - Background service worker
  - `/content` - Content scripts
  - `/popup` - Extension popup UI
  - `/options` - Options page UI
  - `/hooks` - React hooks
  - `/utils` - Utility functions
  - `/_locales` - Localization files
- `/icons` - Extension icons

## 🛠️ Development

### Prerequisites

- Node.js 16+ and npm

### Development Mode

Start the development server:
```bash
npm run dev
```

### Tech Stack

- TypeScript
- React
- TailwindCSS
- Chrome Extension Manifest V3
- Vite (build system)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

