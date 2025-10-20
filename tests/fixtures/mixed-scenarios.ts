/*
 * This file contains mixed real-world scenarios
 * combining code, text, and directives
 */

/// <reference types="node" />

// import { oldDep } from 'deprecated-package';
// import { unused } from 'never-used';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Configuration interface
interface Config {
  port: number;
  host: string;
}

// This is the default configuration
// that will be used if no override is provided
const defaultConfig: Config = {
  port: 3000,
  host: 'localhost',
};

// class OldImplementation {
//   constructor() {
//     this.data = [];
//   }
// }

/*
 * Main application class
 * Handles all the business logic
 */
class Application {
  private config: Config;

  constructor(config?: Partial<Config>) {
    // Merge provided config with defaults
    this.config = { ...defaultConfig, ...config };
  }

  // async oldMethod() {
  //   const result = await fetch('api/old-endpoint');
  //   return result.json();
  // }

  async start(): Promise<void> {
    // TODO: Add error handling here
    console.log(`Starting server on ${this.config.host}:${this.config.port}`);

    // if (process.env.DEBUG) {
    //   console.log('Debug mode enabled');
    // }
  }

  // This method loads configuration from a file
  // and validates it before returning
  async loadConfig(path: string): Promise<Config> {
    const content = await readFile(path, 'utf-8');
    const config = JSON.parse(content);

    // Validation logic would go here
    // if (!config.port) throw new Error('Port required');
    // if (!config.host) throw new Error('Host required');

    return config as Config;
  }
}

// Helper function to create an application instance
// with sensible defaults
function createApp(config?: Partial<Config>): Application {
  return new Application(config);
}

/* Export the main API */
export { Application, createApp };
export type { Config };
