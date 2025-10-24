# AgriPOS - Electron Desktop Application

AgriPOS is a Point of Sale system designed for agriculture businesses, now available as both a web application and a Windows desktop application using Electron.

## Features

- **Dashboard**: Overview of your business metrics
- **POS System**: Point of sale transactions
- **Inventory Management**: Track your agricultural products
- **Categories**: Organize your products
- **Reports**: Business analytics and reporting

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Windows 10/11 (for Windows app development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development version:
```bash
npm run electron-dev
```

This will start both the Next.js development server and the Electron app.

### Available Scripts

- `npm run dev` - Start Next.js development server only
- `npm run electron-dev` - Start both Next.js dev server and Electron app
- `npm run electron` - Start Electron app (requires Next.js to be running)
- `npm run build` - Build Next.js for production
- `npm run electron-pack` - Build and package the Electron app
- `npm run electron-dist` - Create distribution packages
- `npm run dist` - Create Windows installer

## Building for Production

### Create Windows Installer

```bash
npm run dist
```

This will create a Windows installer in the `dist` folder.

### Manual Build Process

1. Build the Next.js app:
```bash
npm run build
```

2. Package the Electron app:
```bash
npm run electron-pack
```

## Keyboard Shortcuts

- `Ctrl+1` - Switch to Dashboard
- `Ctrl+2` - Switch to POS
- `Ctrl+3` - Switch to Inventory
- `Ctrl+B` - Toggle sidebar
- `Ctrl+N` - New sale/item
- `Ctrl+R` - Reload app
- `Ctrl+Shift+I` - Toggle developer tools

## Menu Integration

The app includes native Windows menu integration with:
- File menu (New Sale, Exit)
- View menu (Navigation, Toggle sidebar, Developer tools)
- Help menu (About)

## Architecture

- **main.js**: Electron main process entry point
- **preload.js**: Secure bridge between main and renderer processes
- **app/**: Next.js React application
- **out/**: Static export of Next.js app (generated during build)

## Security Features

- Context isolation enabled
- Node integration disabled in renderer
- Secure preload script for IPC communication
- External link protection

## Troubleshooting

### Common Issues

1. **App won't start**: Make sure all dependencies are installed with `npm install`
2. **Build fails**: Ensure Next.js build completes successfully first
3. **Menu not working**: Check that preload.js is properly loaded
4. **Styling issues**: Verify Tailwind CSS is properly configured

### Development Tips

- Use `Ctrl+Shift+I` to open developer tools for debugging
- Check the console for any Electron-specific errors
- The app automatically reloads when you make changes to the Next.js code

## Distribution

The built Windows installer will be located in the `dist` folder and can be distributed to end users. The installer includes:

- Desktop shortcut
- Start menu entry
- Uninstaller
- Automatic updates support (if configured)

## Future Enhancements

- Auto-updater integration
- Receipt printing
- Database integration
- Offline data synchronization
- Multi-platform support (macOS, Linux)
