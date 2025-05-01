# URL Switch - Chrome Extension

A browser extension for bidirectional URL switching and redirection between related websites.

## Features

- Bidirectional URL conversion and navigation (e.g., github.com ↔ github.dev)
- Rule management system with multiple preset URL conversion rules
- Support for custom user-defined rules
- Global extension toggle and per-rule group enabling/disabling
- Auto-redirect or manual redirect options
- Import/export rules functionality

## Tech Stack

- TypeScript
- React
- TailwindCSS
- Chrome Extension APIs
- Vite (build system)

## Development Setup

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd url-switch
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Development mode
   ```
   npm run dev
   ```

4. Build the extension
   ```
   npm run build
   ```

5. Load the extension in Chrome
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory from this project

## Usage

1. Click the extension icon to see available URL conversions for the current page
2. Configure rules and settings in the options page
3. Toggle auto-redirect mode to automatically switch between related sites

## Project Structure

- `/src` - Source code
  - `/background` - Background service worker
  - `/content` - Content scripts
  - `/popup` - Extension popup UI
  - `/options` - Options page
- `/icons` - Extension icons

## License

[MIT](LICENSE)

