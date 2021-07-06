import React, { useState } from 'react';
import { Button, Input, message, Space, Typography, Select } from 'antd';
import styled from 'styled-components';
import { ToolOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { PostMedia } from '../../backend/media';
import { Tag as TagType } from '../../types/Tag';

const { Paragraph } = Typography;
const { Option } = Select;

interface Props {
  tags: any[];
}

const CreateFixTool: React.FC<Props> = ({ tags }) => {
  const [showFixTool, setShowFixTool] = useState<boolean>(false);
  const [fixToolTxHash, setFixToolTxHash] = useState<string>();
  const [fixToolTags, setFixToolTags] = useState<string[]>([]);

  const asyncPublish = async () => {
    console.log('fixToolTxHash', fixToolTxHash, fixToolTags);

    if (!fixToolTxHash || !fixToolTags) {
      message.warning('please input transactionHash or id');
      return;
    }

    console.log('data', tags);

    try {
      message.success('async loading...');

      const res = await PostMedia({
        txHash: fixToolTxHash,
        tags: fixToolTags || [],
      });
      console.log('res', res);
      if (res.status === 201) {
        message.success('async success. please refresh the page.');
      } else {
        throw new Error('async fail');
      }
    } catch (e) {
      message.error(e.toString());
    }
  };

  return (
    <div>
      <Button onClick={() => setShowFixTool(!showFixTool)}>
        <ToolOutlined />
      </Button>
      {showFixTool ? (
        <StyledContainer>
          <Paragraph>
            If you refresh or leave the page while publishing the contract.
          </Paragraph>
          <Paragraph>
            You can manually synchronize data, enter transactionHash and select
            tags and submit
          </Paragraph>
          <Space className='wrapper'>
            <Input
              onChange={e => setFixToolTxHash(e.target.value)}
              placeholder='Enter transactionHash'></Input>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '200px' }}
              placeholder='Please select'
              onChange={(value: string[]) => setFixToolTags(value)}>
              {tags.map((i: TagType) => (
                <Option key={i.id} value={i.name}>
                  {i.name}
                </Option>
              ))}
            </Select>
            <Button onClick={asyncPublish}>Async</Button>
          </Space>
        </StyledContainer>
      ) : null}
    </div>
  );
};

const StyledContainer = styled.div`
  margin: 20px 0 0 0;
  @media screen and (max-width: 576px) {
    .wrapper {
      display: block;
      & > div {
        margin: 10px 0;
      }
    }
  }
`;

export default CreateFixTool;
