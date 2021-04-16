import { Ask } from '../types/Ask';

export function isBackendAsk(obj: any): obj is Ask {
  return (
    Boolean(obj.currency) && Boolean(obj.type) && obj.type.slice(0, 3) === 'Ask'
  );
}
