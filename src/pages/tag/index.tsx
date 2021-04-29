import React, { useEffect, useState } from 'react';
import { getTags } from '../../backend/tag';
import { Tag } from '../../types/tag';

const TagPage: React.FC = () => {
  const [tags, updateTags] = useState<Tag[]>([]);
  useEffect(() => {
    console.log('tags');
    console.log(tags);
    getTags().then(({ data }) => {
      console.log(data);
      updateTags(data);
    });
  }, []);
  return (
    <>
      {tags && (
        <div>
          {tags.map(t => (
            <div key={t.id}>{t.name}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default TagPage;
