interface StorageArea {
  get(keys: string | string[]): Promise<Record<string, any>>;
  set(items: Record<string, any>): Promise<void>;
}

interface ChromeAPI {
  storage: {
    local: StorageArea;
  };
  alarms: {
    create(name: string, options: { when: number }): Promise<void>;
    clear(name: string): Promise<void>;
    onAlarm?: {
      addListener: (callback: (alarm: { name: string }) => void) => void;
    };
  };
  notifications: {
    create(id: string, options: {
      type: string;
      iconUrl: string;
      title: string;
      message: string;
      priority: number;
    }): void;
  };
}

// Mock storage implementation with initial data
class MockStorage implements StorageArea {
  private storage: Record<string, any> = {
    tasks: [],
    projects: []
  };

  async get(keys: string | string[]): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    const keyArray = typeof keys === 'string' ? [keys] : keys;
    
    for (const key of keyArray) {
      result[key] = this.storage[key];
    }
    
    return result;
  }

  async set(items: Record<string, any>): Promise<void> {
    Object.assign(this.storage, items);
  }
}

// Mock alarm implementation
class MockAlarms {
  private listeners: ((alarm: { name: string }) => void)[] = [];

  async create(name: string, _options: { when: number }): Promise<void> {
    // Simulate alarm trigger after 1 second in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        this.listeners.forEach(listener => listener({ name }));
      }, 1000);
    }
  }

  async clear(_name: string): Promise<void> {}

  onAlarm = {
    addListener: (callback: (alarm: { name: string }) => void) => {
      this.listeners.push(callback);
    }
  };
}

// Create mock implementation
const mockChromeAPI: ChromeAPI = {
  storage: {
    local: new MockStorage()
  },
  alarms: new MockAlarms(),
  notifications: {
    create: (id: string, options: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Notification:', { id, ...options });
      }
    }
  }
};

// Helper to check if running in Chrome extension
const isExtensionEnvironment = (): boolean => {
  return !!(typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local);
};

// Export the appropriate API implementation
export const chromeAPI: ChromeAPI = isExtensionEnvironment() ? window.chrome : mockChromeAPI;