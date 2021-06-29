import React, { useState } from 'react';
import TokenListComponents from '../../components/TokenListSelect';
import { StandardTokenProfile } from '../../types/TokenList';

export default function TokenList() {
  const handlerSelectCurrentToken = (token: StandardTokenProfile) => {
    console.log('token', token);
  };

  // modal 显示/隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div>
      1<button onClick={() => setIsModalVisible(true)}>Select</button>
      <TokenListComponents
        setCurrentToken={handlerSelectCurrentToken}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}></TokenListComponents>
      2
    </div>
  );
}
