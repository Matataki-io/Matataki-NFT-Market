import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Form, Input, Checkbox, Avatar } from 'antd';
import { useWallet } from 'use-wallet';
import ButtonCustom from '../Button/index';
import { shortedWalletAccount } from '../../utils/index';
import { updateUser } from '../../backend/user';

const { TextArea } = Input;
import styled from 'styled-components';
import styles from './index.module.scss';

import { UserOutlined } from '@ant-design/icons';
import { useLogin } from '../../hooks/useLogin';

const { Item } = Form;
// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

interface Props {
  isProfile: boolean;
  setIsProfile: (value: boolean) => void;
}
type RequiredMark = boolean | 'optional';

const Profile: React.FC<Props> = ({ isProfile, setIsProfile }) => {
  const [formProfile] = Form.useForm();
  // 可选
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>(
    'optional'
  );
  const wallet = useWallet();
  const { isRegistered, userDataByWallet, register } = useLogin();

  // 短账号
  const shortedAccount = useMemo(() => {
    if (wallet.status !== 'connected') return 'Not Connected';
    return shortedWalletAccount(wallet.account || '');
  }, [wallet]);

  // 设置默认值
  useEffect(() => {
    if (isRegistered) {
      formProfile.setFieldsValue({
        username: userDataByWallet?.username,
        nickname: userDataByWallet?.nickname,
        bio: userDataByWallet?.bio,
      });
    }
  }, [isRegistered, userDataByWallet, formProfile]);

  const handleOk = () => {
    // 如果没有注册禁止关闭窗口
    if (!isRegistered) return;
    setIsProfile(false);
  };

  const handleCancel = () => {
    // 如果没有注册禁止关闭窗口
    if (!isRegistered) return;
    setIsProfile(false);
  };
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    try {
      let { nickname, bio, username } = values;
      if (isRegistered) {
        // 更新
        const res = await updateUser(Number(userDataByWallet?.id), {
          nickname,
          bio,
          username,
        });
        console.log('res', res);
        if (res.data.code === 200) {
          console.log('reload...');
          setIsProfile(false);
        }
      } else {
        // 注册
        // TODO 需要判断
        await register({ nickname, bio, username });
      }
      setIsProfile(false);
    } catch (e) {
      console.error('e', e.toString());
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title='Complete your profile'
      visible={isProfile}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      closable={isRegistered}>
      <Form
        form={formProfile}
        name='formProfile'
        layout='vertical'
        initialValues={{ requiredMarkValue: requiredMark }}
        width={470}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={requiredMark}
        className={styles.form}>
        <StyledUser>
          <Avatar size={40} icon={<UserOutlined />} />
          <StyledItemUser>
            <div>{shortedAccount}</div>
            <div>Change profile image</div>
          </StyledItemUser>
        </StyledUser>
        <StyledItem
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
          <StyledItemInput
            placeholder='Enter your username'
            maxLength={42}
            allowClear
          />
        </StyledItem>
        <StyledItem
          label='NICKNAME'
          name='nickname'
          required
          rules={[{ required: true, message: 'Please input your nickname.' }]}>
          <StyledItemInput placeholder='nickname' maxLength={42} allowClear />
        </StyledItem>
        <StyledItem label='BIO' name='bio'>
          <StyledItemTextArea
            maxLength={200}
            showCount
            allowClear
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </StyledItem>
        <StyledItem style={{ textAlign: 'right', paddingTop: '20px' }}>
          <ButtonCustom color='dark' type='submit'>
            Save
          </ButtonCustom>
        </StyledItem>
      </Form>
    </Modal>
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
const StyledItem = styled(Item)`
  .ant-form-item-label label {
    /* color: rgba(0, 0, 0, 0.5); */
    /* font-size: 12px; */
  }
`;
const StyledItemInput = styled(Input)`
  min-height: 50px;
`;
const StyledItemTextArea = styled(TextArea)``;
export default Profile;
