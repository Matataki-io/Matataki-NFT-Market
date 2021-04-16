import { Ask } from '../types/Ask';

export function isBackendAsk(obj: any): obj is Ask {
  console.log('obj', obj);
  return (
    Boolean(obj.currency) && (obj.type ? obj.type.slice(0, 3) === 'Ask' : false)
  );
}
