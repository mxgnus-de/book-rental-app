import { BaseEnvironment } from './environment.base';

declare global {
   namespace NodeJS {
      interface ProcessEnv extends BaseEnvironment {}
   }
}

export {};
