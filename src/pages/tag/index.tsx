import React, { useEffect, useState } from 'react';
import { getTags } from '../../backend/tag';
import { Tag } from '../../types/tag';
import { List } from 'antd';

const TagPage: React.FC = () => {
  const [tags, updateTags] = useState<Tag[]>([]);
  useEffect(() => {
    getTags().then(({ data }) => {
      updateTags(data);
    });
  }, []);
  return (
    <>
      {tags && (
        <List
          bordered
          dataSource={tags}
          renderItem={item => <List.Item>{item.name}</List.Item>}
        />
      )}
    </>
  );
};

export default TagPage;
