import { Ask } from '../types/Ask';

export function isBackendAsk(obj: any): obj is Ask {
  return Boolean(obj.currency) && obj.type.slice(0, 3) === 'Ask';
}
