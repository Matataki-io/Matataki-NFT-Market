import React, { useState } from 'react';
import { Button, Input, message, Space, Typography } from 'antd';
import styled from 'styled-components';
import { ToolOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { PostMedia } from '../../backend/media';
import { Tag as TagType } from '../../types/Tag';

const { Paragraph } = Typography;

interface Props {
  data: any[];
  galleryId: number;
}

const PublishFixTool: React.FC<Props> = ({ data, galleryId }) => {
  const [showFixTool, setShowFixTool] = useState<boolean>(false);
  const [fixToolTxHash, setFixToolTxHash] = useState<string>();
  const [fixToolId, setFixToolId] = useState<number>();

  const asyncPublish = async () => {
    console.log('fixToolTxHash', fixToolTxHash, fixToolId);

    if (!fixToolTxHash || !fixToolId) {
      message.warning('please input transactionHash or id');
      return;
    }

    let nft = data.find(i => Number(i.id) === Number(fixToolId));
    if (isEmpty(nft)) {
      message.warning('not nft info');
      return;
    }

    console.log('data', data, nft);

    try {
      message.success('async loading...');

      const res = await PostMedia({
        txHash: fixToolTxHash,
        tags: nft.tags.map((t: TagType) => t.name),
        gallery: Number(galleryId),
        id: Number(nft.id),
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
            nft and submit
          </Paragraph>
          <Space className='wrapper'>
            <Input
              onChange={e => setFixToolTxHash(e.target.value)}
              placeholder='Enter transactionHash'></Input>
            <Input
              onChange={e => setFixToolId(Number(e.target.value))}
              placeholder='Enter Id'></Input>
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
    .wrapper > div {
      margin: 10px 0;
    }
  }
`;

export default PublishFixTool;
