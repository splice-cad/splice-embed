# @splice-cad/embed

Embed Splice harness diagrams on your website with a simple JavaScript library.

## Installation

### CDN (Recommended)

```html
<script src="https://cdn.jsdelivr.net/npm/@splice-cad/embed@0.1.0-beta.1/dist/splice-embed.iife.js"></script>
```

### NPM

```bash
npm install @splice-cad/embed
```

## Quick Start

### Simple Usage (Public Harness)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/@splice-cad/embed@0.1.0-beta.1/dist/splice-embed.iife.js"></script>
</head>
<body>
  <div id="harness-container"></div>

  <script>
    Splice.embed('harness-container', 'your-harness-id', {
      width: '800px',
      height: '600px',
      showBOM: true
    });
  </script>
</body>
</html>
```

### Private Harness

```javascript
Splice.embed('harness-container', 'your-harness-id', {
  token: 'your-share-token', // Get from harness settings
  theme: 'dark',
  showBOM: true
});
```

### With Custom Styling

```javascript
Splice.embed('harness-container', 'your-harness-id', {
  styles: {
    backgroundColor: '#1e1e1e',
    textColor: '#e0e0e0',
    connectorFill: '#2a2a2a'
  }
});
```

## Features

- 🚀 Simple CDN-based loading
- 🎨 Fully customizable styling (CSS variables, JS options, web component attributes)
- 📱 Responsive and mobile-friendly
- 🔍 Interactive pan and zoom
- 📋 Optional BOM table display
- 🌓 Built-in theme presets (light, dark, high-contrast, blueprint)
- 🔒 Secure with share tokens
- 📦 Tiny bundle size (<100KB gzipped)

## API Reference

### `Splice.embed(containerId, harnessId, options)`

Creates an embedded harness viewer.

**Parameters:**
- `containerId` (string): ID of the container element
- `harnessId` (string): UUID of the harness to display
- `options` (object): Configuration options

**Options:**
- `token` (string): Share token for private harnesses
- `width` (string): Width of the container (default: '100%')
- `height` (string): Height of the container (default: '600px')
- `theme` ('light' | 'dark' | 'auto'): Theme preset
- `showBOM` (boolean): Display BOM table
- `showTitle` (boolean): Display harness title
- `interactive` (boolean): Enable pan/zoom controls
- `styles` (object): Custom style overrides
- `onLoad` (function): Callback when harness loads
- `onError` (function): Callback on error

**Returns:** Controller object with methods:
- `zoomIn()`: Zoom in
- `zoomOut()`: Zoom out
- `fitToView()`: Fit harness to viewport
- `destroy()`: Remove the embed
- `update(options)`: Update options dynamically

## Documentation

- [Full Documentation](https://splice-cad.com/#/docs)
- [Examples](./examples)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build library
npm run build

# Type check
npm run type-check
```

## License

MIT © Splice CAD

## Support

- [GitHub Issues](https://github.com/splice-cad/splice-embed/issues)
- [Documentation](https://splice-cad.com/#/docs)
- [Main Website](https://splice-cad.com)
