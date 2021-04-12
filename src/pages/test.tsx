import React from 'react';
import NFT from '../components/NFT';

const nftData: any = {
  id: 0,
  type: 'audio',
  fields: {},
  content: {
    medium:
      'http://matataki-client-test.oss-cn-shanghai.aliyuncs.com/assets/obj_wo3DlMOGwrbDjj7DisKw_8180382008_ac81_a14f_e677_a260c835f51b994a2143067f11aa0f0b.mp3',
  },
  avatar_url: '',
  username: 'xiaotian',
  title: 'xiaotian',
  time: Date.now(),
};

const TestPage = () => {
  return (
    <div style={{ width: 330, minHeight: 400, boxSizing: 'border-box' }}>
      <NFT {...nftData}></NFT>
    </div>
  );
};

export default TestPage;
