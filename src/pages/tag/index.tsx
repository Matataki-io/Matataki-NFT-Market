import React, { useEffect, useState } from 'react';
import { createTag, deleteTag, getTags } from '../../backend/tag';
import { Tag } from '../../types/tag';
import { Button, Form, Input, List, message } from 'antd';

const TagPage: React.FC = () => {
  const [tags, updateTags] = useState<Tag[]>([]);
  useEffect(() => {
    getTags().then(({ data }) => {
      updateTags(data);
    });
  }, []);

  const onFinish = async ({ name }) => {
    const { data } = await createTag(name);
    if (data.code === 200) {
      message.success('Create Success');
      updateTags([...tags, data.data]);
    }
  };

  const deleteT = async name => {
    const { data } = await deleteTag(name);
    if (data.code === 200) {
      message.success('Delete Success');
      updateTags(tags.filter(t => t.name !== name));
    }
  };

  return (
    <>
      <Form onFinish={onFinish}>
        <Form.Item
          label='Tag name'
          name='name'
          rules={[{ required: true, message: 'Please input your tag name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Add Tag
          </Button>
        </Form.Item>
      </Form>

      {tags && (
        <List
          bordered
          dataSource={tags}
          renderItem={item => (
            <List.Item>
              {item.name}
              <Button onClick={() => deleteT(item.name)}>Delete</Button>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default TagPage;
