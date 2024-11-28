/// <reference types="vite/client" />

interface Window {
  chrome?: {
    storage: {
      local: {
        get(keys: string | string[]): Promise<Record<string, any>>;
        set(items: Record<string, any>): Promise<void>;
      };
    };
    alarms: {
      create(name: string, options: { when: number }): Promise<void>;
      clear(name: string): Promise<void>;
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
  };
}