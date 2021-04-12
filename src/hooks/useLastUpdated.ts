import { useState } from 'react';

export function useLastUpdated() {
  const [lastUpdated, setUpdateTime] = useState<Date>(new Date(0));

  const updated = () => setUpdateTime(new Date());
  return { lastUpdated, updated };
}
