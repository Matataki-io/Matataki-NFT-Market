import { Input, Loading } from '@geist-ui/react';
import { useDebounce } from 'ahooks';
import React, { useState } from 'react';
import useSWR from 'swr';
import { backendSWRFetcher } from '../../backend/media';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, { wait: 1000 });

  const { data, error } = useSWR(
    `/search?keyword=${debouncedKeyword}`,
    backendSWRFetcher
  );

  return (
    <div className='simple-search-page'>
      <div className='search-box'>
        <Input
          placeholder='Enter keywords to search'
          onChange={e => setKeyword(e.target.value)}
        />
      </div>
      <div className='title'>Search {debouncedKeyword}</div>
      {error && <div>failed to search</div>}
      {!data && <Loading>Searching now...</Loading>}

      {data && (
        <div className='search-result' style={{ marginTop: '100px' }}>
          {JSON.stringify(data)}
        </div>
      )}
    </div>
  );
}
