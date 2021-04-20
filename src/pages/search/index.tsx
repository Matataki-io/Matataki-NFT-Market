import {
  Card,
  Image,
  Input,
  Loading,
  Text,
  User as UserComponent,
} from '@geist-ui/react';
import { useDebounce } from 'ahooks';
import React, { useState } from 'react';
import useSWR from 'swr';
import { backendSWRFetcher } from '../../backend/media';
import { Media } from '../../types/Media.entity';
import { User } from '../../types/User.types';

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
      <Text h1>Search {debouncedKeyword}</Text>
      {error && <div>failed to search</div>}
      {!data && <Loading>Searching now...</Loading>}

      {data && (
        <div className='search-result' style={{ marginTop: '10px' }}>
          <div className='matched-users'>
            <Text h2>Matched Users</Text>
            {data.matchedUsers.map((user: User) => (
              <UserComponent
                src={user.avatar}
                key={user.username}
                name={user.nickname}>
                <UserComponent.Link href={`/${user.username}`}>
                  @{user.username}
                </UserComponent.Link>
              </UserComponent>
            ))}
          </div>
          <div className='matched-medias'>
            <Text h2>Matched Medias</Text>
            {data.matchedMedias.map((media: Media) => (
              <Card key={media.id} shadow>
                <Image src={media.tokenURI} width={100} />
                <h4>{media.title}</h4>
                <p>{media.description}</p>
                <p>By @{media.creator?.username}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
