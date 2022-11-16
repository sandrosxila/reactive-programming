import {Response} from './data.d';

declare global {
  interface Window {
    eqfeed_callback: { (response: Response): void, data?: Response };
  }
}
