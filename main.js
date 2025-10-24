const { app, BrowserWindow, Menu, shell } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextProcess;

// Keep a global reference of the window object
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
    titleBarStyle: 'default',
    show: false, // Don't show until ready
    title: 'AgriPOS - Point of Sale System'
  });

  // Load the app
  if (isDev) {
    // In development, load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the static files
    mainWindow.loadFile(path.join(__dirname, 'out/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'file://') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Sale',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-sale');
          }
        },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            mainWindow.webContents.send('menu-action', 'dashboard');
          }
        },
        {
          label: 'POS',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            mainWindow.webContents.send('menu-action', 'pos');
          }
        },
        {
          label: 'Inventory',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            mainWindow.webContents.send('menu-action', 'inventory');
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('menu-action', 'toggle-sidebar');
          }
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About AgriPOS',
          click: () => {
            mainWindow.webContents.send('menu-action', 'about');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Start Next.js development server in development
function startNextDevServer() {
  if (isDev) {
    nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    nextProcess.on('error', (err) => {
      console.error('Failed to start Next.js dev server:', err);
    });
  }
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();
  startNextDevServer();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
