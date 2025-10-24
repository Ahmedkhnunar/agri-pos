// TypeScript declarations for Electron API
declare global {
  interface Window {
    electronAPI: {
      onMenuAction: (callback: (event: any, action: string) => void) => void;
      removeAllListeners: (channel: string) => void;
      platform: string;
      appVersion: string;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      saveData: (data: any) => Promise<void>;
      loadData: () => Promise<any>;
      print: (data: any) => Promise<void>;
      showNotification: (title: string, body: string) => Promise<void>;
    };
  }
}

export {};
