import React, { useState } from 'react';
import { Modal, Button, Form, Input, Checkbox, Avatar } from 'antd';
const { TextArea } = Input;
import styled from 'styled-components';

import { UserOutlined } from '@ant-design/icons';
import { useLogin } from '../../hooks/useLogin';

type RequiredMark = boolean | 'optional';

// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

const Profile: React.FC<any> = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>(
    'optional'
  );

  const { register } = useLogin();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    let { nickname, bio, username } = values;
    // await register({ nickname, bio, username });
    console.log('nickname', nickname, bio, username);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Button type='primary' onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title='Complete your profile'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}>
        <Form
          form={form}
          name='basic'
          layout='vertical'
          initialValues={{ requiredMarkValue: requiredMark }}
          width={470}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={requiredMark}>
          <StyledUser>
            <Avatar size={40} icon={<UserOutlined />} />
            <StyledItemUser>
              <div>0x3484040A...14ecCcA6</div>
              <div>Change profile image</div>
            </StyledItemUser>
          </StyledUser>
          <Form.Item
            label='USERNAME'
            name='username'
            required
            rules={[
              {
                required: true,
                message: 'Please input your username.',
              },
              {
                required: true,
                pattern: usernamePattern,
                message: `Only numbers, characters a-z '-' and the length is 5-20 are acceptable.`,
              },
            ]}>
            <Input
              placeholder='Enter your username'
              maxLength={42}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label='NICKNAME'
            name='nickname'
            required
            rules={[
              { required: true, message: 'Please input your nickname.' },
            ]}>
            <Input placeholder='nickname' maxLength={42} allowClear />
          </Form.Item>
          <Form.Item label='BIO' name='bio'>
            <TextArea
              maxLength={200}
              showCount
              allowClear
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
const StyledUser = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
`;
const StyledItemUser = styled.div`
  margin-left: 15px;
  font-size: 14px;
  color: #000;
  line-height: 20px;
  & > div:first-child {
    font-weight: 500;
  }
  & > div:last-child {
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: all 0.125s ease-in 0s;
    &:hover {
      color: rgb(0, 0, 0);
      text-decoration: underline;
    }
  }
`;

export default Profile;
