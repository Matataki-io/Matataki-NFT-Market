import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  Avatar,
  message,
  Upload,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib/upload/interface';
import { useWallet } from 'use-wallet';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import ButtonCustom from '../Button/index';
import { shortedWalletAccount } from '../../utils/index';
import { updateUser } from '../../backend/user';
import { useLogin } from '../../hooks/useLogin';
import styles from './index.module.scss';
import { storageUploadFile } from '../../backend/storage';
import { isEmpty } from 'lodash';

const { TextArea } = Input;
const { Item } = Form;
// 用户名校验
const usernamePattern = /^(?=[a-z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

interface Props {
  isProfile: boolean;
  setIsProfile: (value: boolean) => void;
}
type RequiredMark = boolean | 'optional';

interface UserProps {
  nickname?: string;
  bio?: string;
  username?: string;
  avatar?: string;
}

const Profile: React.FC<Props> = ({ isProfile, setIsProfile }) => {
  const [formProfile] = Form.useForm();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>();

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
      setAvatarUrl(userDataByWallet?.avatar || '');
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
        // diff
        const diffData = (newData: any, oldData: any) => {
          let data: any = {};
          for (const key in newData) {
            if (Object.prototype.hasOwnProperty.call(newData, key)) {
              if (newData[key] !== oldData[key]) {
                data[key] = newData[key];
              }
            }
          }
          return data;
        };
        let profile: UserProps = diffData(
          {
            username,
            nickname,
            bio,
            avatar: avatarUrl!,
          } as UserProps,
          {
            username: userDataByWallet?.username,
            nickname: userDataByWallet?.nickname,
            bio: userDataByWallet?.bio,
            avatar: userDataByWallet?.avatar,
          } as UserProps
        );
        if (isEmpty(profile)) {
          message.info('没有修改');
          return;
        }
        const res = await updateUser(Number(userDataByWallet?.id), profile);
        console.log('res', res);
        if (res.data.code === 200) {
          setIsProfile(false);
          router.push(`/${username}`);
        } else {
          message.error('更新失败');
        }
      } else {
        // 注册
        await register({ nickname, bio, username, avatar: avatarUrl! });
      }
      setIsProfile(false);
    } catch (e) {
      console.error('e', e.toString());
      message.error(`更新失败${e.toString()}`);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const props: UploadProps = {
    accept: 'image/jpeg, image/png',
    name: 'file',
    action: storageUploadFile,
    method: 'PUT',
    maxCount: 1,
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        let url = info.file.response.data.url;
        setAvatarUrl(url);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file: File) {
      message.info('Uploading...');

      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
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
        // width={470}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={requiredMark}
        className={styles.form}>
        <StyledUser>
          <Avatar size={40} icon={<UserOutlined />} src={avatarUrl} />
          <StyledItemUser>
            <div>{shortedAccount}</div>
            <Upload {...props} className='upload'>
              <div>Change profile image</div>
            </Upload>
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
  .upload {
    .ant-upload-list {
      display: none;
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
