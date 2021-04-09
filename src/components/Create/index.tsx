import React, { useState, Fragment, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useWallet } from 'use-wallet';
import { useSigner } from '../../hooks/useSigner';
import { Signer } from 'ethers';

import ButtonCustom from '../Button';
import NFT from '../NFT';
import { firstUpperCase } from '../../utils/index';
import { storageUploadToIpfsUrl } from '../../backend/storage';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Upload,
  message,
  Button,
  Spin,
  Tooltip,
} from 'antd';
const { Dragger } = Upload;

import { mintMediaToken } from '../../blockchain/nft';

import { UploadProps } from 'antd/lib/upload/interface';

import { NFTProps } from '../../../next-env';
import {
  NFTTempImage,
  NFTTempVideo,
  NFTTempAudio,
  NFTTempText,
  NFTTempFile,
  NFTTempUrl,
} from './temp';

interface mediaDataState extends NFTProps {
  storage?: any;
}

interface mediaTypeState {
  [key: string]: string;
  image: string;
  video: string;
  audio: string;
  text: string;
  file: string;
  url: string;
}
interface Props {
  setIsCreate: (value: boolean) => void;
}
type mediaTypeProps = 'image' | 'video' | 'audio' | 'text' | 'file' | 'url';

const CreateComponents: React.FC<Props> = ({ setIsCreate }) => {
  const wallet = useWallet();
  const { signer, isSignerReady } = useSigner();

  const [step, setStep] = useState<number>(0); // 步骤
  const [mediaType, setMediaType] = useState<mediaTypeProps>('image'); // 当前上传媒体类型
  const [mediaUrl, setMediaUrl] = useState<string>(''); // 媒体类型为Url的Value
  const [formNameAndDescription] = Form.useForm();
  const [formPricingAndFees] = Form.useForm();
  const [mediaData, setMediaData] = useState<mediaDataState>({}); // media 数据
  // const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  // 媒体类型 placeholder
  const mediaPlaceholder: mediaTypeState = {
    image: `You can drag and drop your file here.\n.png, .jpg, and .gif are supported`,
    video: `You can drag and drop your file here.\n.mp4, and .mov are supported`,
    audio: `You can drag and drop your file here.\n.mp3, and .wav are supported`,
    text: `You can drag and drop your file here.\n.txt, and .md are supported`,
    file: `You can drag and drop your file here.\n.pdf, .psd, and .ai are supported`,
    url: ``,
  };
  // 媒体上传 accept
  const mediaAccept: string = useMemo(() => {
    let list: { [key: string]: string } = {
      image: 'image/jpeg, image/png, image/gif',
      video: 'video/mp4, video/quicktime',
      audio:
        'audio/mpeg, audio/mp3, audio/vnd.wav, audio/wav, audio/vnd.wave, audio/wave, audio/x-wav',
      text: 'text/markdown, text/x-markdown, text/plain',
      file:
        'image/vnd.adobe.photoshop, application/pdf, application/postscript',
      url: '',
    };

    return list[mediaType] || '';
  }, [mediaType]);
  // 媒体上传 size
  const mediaSize = useMemo(() => {
    let list: { [key: string]: number } = {
      image: 4,
      video: 10,
      audio: 10,
      file: 10,
      url: 0,
    };

    return list[mediaType] || 2;
  }, [mediaType]);

  // 媒体上传 props
  const uploadProps: UploadProps = {
    accept: mediaAccept,
    name: 'file',
    multiple: true,
    action: storageUploadToIpfsUrl,
    data: {
      name: formNameAndDescription.getFieldsValue().name,
      description: formNameAndDescription.getFieldsValue().description,
    },
    method: 'PUT',
    maxCount: 1,
    onChange(info: any) {
      console.log('info', info);
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (mediaType === 'image') {
          let url = info.file.response.data.MediaData.tokenURI;
          let storage = info.file.response.data;
          setMediaDataFn({
            url,
            type: mediaType,
            storage: storage,
          });
        } else {
          message.info('暂时只支持Image.');
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file: File): boolean {
      console.log('file', file);
      message.info('正在上传...');

      let mediaAcceptList = mediaAccept.split(',');
      const mediaAcceptResult = mediaAcceptList.find(
        i => i.trim() === file.type
      );
      // console.log('mediaAcceptResult', mediaAcceptResult);

      if (!mediaAcceptResult) {
        message.error(`You can only upload ${mediaAccept} file!`);
      }
      const isLtSize = file.size / 1024 / 1024 < mediaSize;
      if (!isLtSize) {
        message.error(
          `${firstUpperCase(mediaType)} must smaller than ${mediaSize}MB!`
        );
      }
      return !!mediaAcceptResult && isLtSize;
    },
  };

  // 设置 media 数据
  const setMediaDataFn = ({
    url,
    type,
    storage,
  }: {
    url: string;
    type: string;
    storage: any;
  }) => {
    console.log('setMediaDataFn url', url);
    let mediaData: { [key: string]: any } = Object.create(null);
    if (type === 'image') {
      let data = Object.assign({}, NFTTempImage);
      mediaData = Object.assign(data, {
        type: 'image',
        content: {
          low: url,
          medium: url,
          high: url,
          thumbnail: url,
          stream: '',
        },
      });
    } else if (type === 'video') {
      let data = Object.assign({}, NFTTempVideo);
      mediaData = Object.assign(data, {
        type: 'video',
        fields: {
          low: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/low.mp4',
          },
          stream: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY.m3u8',
          },
          medium: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/medium.mp4',
          },
          high: {
            stringValue:
              'https://stream.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/high.mp4',
          },
          thumbnail: {
            stringValue:
              'https://image.mux.com/sX001r6PlJeeGp5nhfr9FxDSrRfABMShhg2FWxDEWuKY/thumbnail.png',
          },
        },
      });
    } else if (type === 'audio') {
      let data = Object.assign({}, NFTTempAudio);
      mediaData = Object.assign(data, {
        type: 'audio',
        content: {
          low:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          medium:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          high:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          thumbnail:
            'https://ipfs.io/ipfs/bafybeih6ob427hktbl6xfzunyz4tjop4cwmhzhgp4zp5dd3jwa2fyfn264',
          stream: '',
        },
      });
    } else if (type === 'text') {
      let data = Object.assign({}, NFTTempText);
      mediaData = Object.assign(data, {
        type: 'text',
        content: {
          low:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeie2woanvrkua3zgzw7qifrbd46ksr45skjsny35bc542yik6cuizi',
          stream: '',
        },
      });
    } else if (type === 'file') {
      let data = Object.assign({}, NFTTempFile);
      mediaData = Object.assign(data, {
        type: 'text',
        content: {
          thumbnail:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          low:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          medium:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          high:
            'https://ipfs.fleek.co/ipfs/bafybeibjhlwso6swp5gomkg75brvqpcmaai65wjskqpkvac2qolc6mw7hy',
          stream: '',
        },
      });
    } else if (type === 'url') {
      let data = Object.assign({}, NFTTempUrl);
      mediaData = Object.assign(data, {
        type: 'url',
        content: {
          thumbnail: mediaUrl,
          low: mediaUrl,
          medium: mediaUrl,
          high: mediaUrl,
          stream: '',
        },
      });
    } else {
      console.warn('type is undefined', type);
      return;
    }
    // 返回的所有数据存入 storage
    mediaData['storage'] = storage;
    setMediaData(mediaData);
  };

  // 信息填写完成
  const onFinishInfo = (values: any) => {
    console.log('Success:', values);
    // let formalue = formNameAndDescription.getFieldsValue();
    // console.log('formValue', formValue);
    setStep(1);
  };
  // 信息填写失败
  const onFinishFailedInfo = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 媒体上传 continue
  const onFinishUpload = () => {
    if (mediaData['storage']) {
      setStep(2);
    } else {
      message.warning('请上传资源');
    }
  };
  // price填写完成
  const onFinishPrice = async (values: any) => {
    console.log('Success:', values);

    let {
      tokenURI,
      metadataURI,
      contentHash,
      metadataHash,
    } = mediaData.storage['MediaData'];
    let creatorShare = Number(formPricingAndFees.getFieldsValue().price);
    console.log(
      'info',
      tokenURI,
      metadataURI,
      contentHash,
      metadataHash,
      creatorShare
    );

    // 获取 Signer
    let wallet: Signer;

    if (!isSignerReady(signer)) {
      message.error('No Signer detected');
      return;
    }
    wallet = signer;

    try {
      const res = await mintMediaToken(
        tokenURI,
        metadataURI,
        contentHash,
        metadataHash,
        creatorShare,
        wallet
      );
      console.log('res', res);
      message.success('mint success...');
    } catch (e) {
      console.log('e', e);
    }
  };
  // price填写失败
  const onFinishFailedPrice = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const Step0: React.FC = () => {
    return (
      <Fragment>
        <StyledSubtitle>Add information</StyledSubtitle>
        <StyledMultiiMediaForm
          name='nameAndDescription'
          form={formNameAndDescription}
          layout='vertical'
          initialValues={{}}
          onFinish={onFinishInfo}
          onFinishFailed={onFinishFailedInfo}>
          <StyledMultiiMediaFormItem className='input'>
            <Form.Item
              label='Name'
              name='name'
              rules={[{ required: true, message: 'Name is required' }]}>
              <Input placeholder='Enter Name' className='input-name' />
            </Form.Item>

            <Form.Item
              label='Description'
              name='description'
              rules={[{ required: true, message: 'Description is required' }]}>
              <Input.TextArea
                placeholder='Enter Description'
                className='input-textarea'
              />
            </Form.Item>
          </StyledMultiiMediaFormItem>
          <StyledMultiiMediaFormItem className='footer'>
            <ButtonCustom color='gray' onClick={() => setIsCreate(false)}>
              Back
            </ButtonCustom>
            <ButtonCustom color='dark' disabled={false} type='submit'>
              Continue
            </ButtonCustom>
          </StyledMultiiMediaFormItem>
        </StyledMultiiMediaForm>
      </Fragment>
    );
  };

  const Step1: React.FC = () => {
    return (
      <Fragment>
        <StyledSubtitle>Upload</StyledSubtitle>
        <StyledMultiiMediaInput>
          <StyledMultiiMediaInputHead>
            <StyledMultiiMediaInputHeadTab
              actions={mediaType === 'image'}
              onClick={() => setMediaType('image')}>
              Image
            </StyledMultiiMediaInputHeadTab>
            <StyledMultiiMediaInputHeadTab
              actions={mediaType === 'video'}
              onClick={() => setMediaType('video')}>
              Video
            </StyledMultiiMediaInputHeadTab>
            <StyledMultiiMediaInputHeadTab
              actions={mediaType === 'audio'}
              onClick={() => setMediaType('audio')}>
              Audio
            </StyledMultiiMediaInputHeadTab>
            <StyledMultiiMediaInputHeadTab
              actions={mediaType === 'text'}
              onClick={() => setMediaType('text')}>
              Text
            </StyledMultiiMediaInputHeadTab>
            <StyledMultiiMediaInputHeadTab
              actions={mediaType === 'file'}
              onClick={() => setMediaType('file')}>
              File
            </StyledMultiiMediaInputHeadTab>
            <StyledMultiiMediaInputHeadTab
              actions={mediaType === 'url'}
              onClick={() => setMediaType('url')}>
              URL
            </StyledMultiiMediaInputHeadTab>
          </StyledMultiiMediaInputHead>
          {mediaType !== 'url' ? (
            <StyledMultiiMediaInputWrapper>
              <Dragger {...uploadProps} className='upload'>
                <p>{mediaPlaceholder[mediaType]}</p>
              </Dragger>
            </StyledMultiiMediaInputWrapper>
          ) : (
            // bottom, type is url show
            <StyledMultiiMediaInputContainer>
              <label className='label'>Enter URL</label>
              <input
                type='text'
                className='input'
                value={mediaUrl}
                onChange={e => {
                  setMediaUrl(e.target.value);
                  setMediaDataFn({
                    url: e.target.value,
                    type: 'url',
                    storage: {},
                  });
                }}></input>
            </StyledMultiiMediaInputContainer>
          )}
        </StyledMultiiMediaInput>
        <StyledMultiiMediaActions>
          <ButtonCustom color='gray' onClick={() => setStep(0)}>
            Back
          </ButtonCustom>
          <ButtonCustom color='dark' disabled={false} onClick={onFinishUpload}>
            Continue
          </ButtonCustom>
        </StyledMultiiMediaActions>
      </Fragment>
    );
  };

  const Step2: React.FC = () => {
    return (
      <Fragment>
        <StyledSubtitle>Pricing & fees</StyledSubtitle>
        <StyledMultiiMediaForm
          name='pricingAndFees'
          form={formPricingAndFees}
          layout='vertical'
          initialValues={{}}
          onFinish={onFinishPrice}
          onFinishFailed={onFinishFailedPrice}>
          <StyledMultiiMediaFormItem className='input'>
            <Form.Item label='Resale royalty' required>
              <Tooltip title='Resale royalty'>
                <StyledMultiiMediaFormItemText>
                  A percentage fee that you receive for all secondary sales of
                  this piece.
                </StyledMultiiMediaFormItemText>
              </Tooltip>
              <Form.Item
                name='price'
                rules={[
                  {
                    required: true,
                    message: 'Creator share percentage is required',
                  },
                  {
                    // 好像不work
                    type: 'number',
                    required: true,
                    min: 0,
                    max: 100,
                    message: 'Creator share range is [0, 100]',
                  },
                ]}>
                <InputNumber
                  placeholder='Enter percentage'
                  className='input-name-number'
                  type='number'
                  min={0}
                  max={100}
                />
              </Form.Item>
            </Form.Item>
          </StyledMultiiMediaFormItem>
          <StyledMultiiMediaFormItem className='footer'>
            <ButtonCustom color='gray' onClick={() => setStep(1)}>
              Back
            </ButtonCustom>
            <ButtonCustom color='dark' disabled={false} type='submit'>
              Continue
            </ButtonCustom>
          </StyledMultiiMediaFormItem>
        </StyledMultiiMediaForm>
      </Fragment>
    );
  };

  return (
    <StyledWrapper>
      <StyledContainer>
        <StyledContainerGrid>
          <StyledContainerGridCol start='0' end='6'>
            <StyledTitle>Create Media</StyledTitle>
            {step === 0 ? (
              <Step0></Step0>
            ) : step === 1 ? (
              <Step1></Step1>
            ) : step === 2 ? (
              <Step2></Step2>
            ) : (
              ''
            )}
          </StyledContainerGridCol>
          <StyledContainerGridCol start='7' end='12'>
            <StyledSubtitle>Preview</StyledSubtitle>
            <div style={{ width: '100%', minHeight: '133%' }}>
              <NFT {...mediaData}></NFT>
            </div>
          </StyledContainerGridCol>
        </StyledContainerGrid>
      </StyledContainer>
    </StyledWrapper>
  );
};

const StyledSpinContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledUploadWrapper = styled.div`
  width: 100%;
  position: relative;
`;
const StyledWrapper = styled.div`
  margin: 0px;
  padding: 130px 0px;
  background: rgb(255, 255, 255);
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  inset: 0px;

  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;
const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledContainer = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(1246px);
`;
const StyledContainerGrid = styled.div`
  width: 100%;
  display: inline-grid;
  column-gap: 30px;
  grid-template-columns: repeat(12, 1fr);
`;
const StyledContainerGridCol = styled.div<{ start?: string; end?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  ${props =>
    props.start &&
    props.end &&
    css`
      height: auto;
      grid-column: ${Number(props.start) + 1} / ${Number(props.end) + 1};
    `}
`;
const StyledTitle = styled.h2`
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 50px;
  margin-top: 0;
  color: #000;
`;
const StyledSubtitle = styled.h4`
  font-weight: 500;
  margin-bottom: 25px;
  font-size: 20px;
  margin-top: 0px;
  color: #000;
`;
const StyledMultiiMediaInput = styled.div`
  width: 100%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0px 0px;
  position: relative;
`;
const StyledMultiiMediaInputHead = styled.div`
  color: #000;
  width: auto;
  padding: 0px 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const StyledMultiiMediaInputHeadTab = styled.h5<{ actions?: boolean }>`
  position: relative;
  color: initial;
  margin-right: 20px;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 17px;
  font-weight: 400;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
  &::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    left: 0px;
    right: 0px;
    bottom: -17px;
  }
  ${props =>
    props.actions &&
    css`
      color: rgb(0, 0, 0);
      font-weight: 600;
      &::after {
        background: rgb(0, 0, 0);
      }
    `}
  &:hover {
    color: rgb(0, 0, 0);
    &::after {
      background: rgb(0, 0, 0);
    }
  }
`;
const StyledMultiiMediaInputWrapper = styled.div`
  width: auto;
  height: 100px;
  margin: 20px;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    text-align: center;
    white-space: pre-wrap;
    line-height: 20px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.5);
    margin-bottom: 0px;
    font-weight: 400;
    margin-top: 0px;
  }
  .upload {
    border: 0;
    background: transparent;
  }
  & > span {
    width: 100%;
    height: 100%;
  }
  .ant-upload-list {
    display: none;
  }
`;
const StyledMultiiMediaInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 15px;
  .label {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    line-height: 20px;
    margin-bottom: 10px;
    display: block;
  }
  .input {
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    min-height: 50px;
    font-size: 15px;
    line-height: 14px;
    font-weight: 400;
    transition: all 0.1s ease-in 0s;
    color: rgb(0, 0, 0);
    border: 1px solid transparent;
    background: rgba(0, 0, 0, 0.05);
    outline: none;
  }
`;
const StyledMultiiMediaActions = styled.div`
  width: 100%;
  padding: 20px;
  border-right: 2px solid rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  border-image: initial;
  border-top: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledMultiiMediaForm = styled(Form)`
  width: 100%;
`;
const StyledMultiiMediaFormItem = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &.input {
    border: 2px solid rgba(0, 0, 0, 0.1);
    label {
      font-size: 17px;
      font-weight: 500;
      color: rgb(0, 0, 0);
      text-transform: none;
    }
  }
  .input-name {
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    min-height: 50px;
    font-size: 15px;
    line-height: 14px;
    font-weight: 400;
    transition: all 0.1s ease-in 0s;
    color: rgb(0, 0, 0);
    border: 1px solid transparent;
    background: rgba(0, 0, 0, 0.05);
    outline: none;
  }
  .input-name-number {
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    min-height: 50px;
    font-size: 15px;
    line-height: 14px;
    font-weight: 400;
    transition: all 0.1s ease-in 0s;
    color: rgb(0, 0, 0);
    border: 1px solid transparent;
    background: rgba(0, 0, 0, 0.05);
    outline: none;
  }
  .input-textarea {
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    font-size: 15px;
    font-weight: 400;
    transition: all 0.1s ease-in 0s;
    color: rgb(0, 0, 0);
    border: 1px solid transparent;
    background: rgba(0, 0, 0, 0.05);
    outline: none;
    line-height: 20px;
    min-height: 100px;
    resize: none;
  }
  &.footer {
    border-right: 2px solid rgba(0, 0, 0, 0.1);
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    border-left: 2px solid rgba(0, 0, 0, 0.1);
    border-image: initial;
    border-top: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  & > div {
    width: 100%;
  }
`;
const StyledMultiiMediaFormItemText = styled.p`
  font-size: 17px;
  font-weight: 400;
  margin-top: 0px;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
  line-height: 1.15;
`;
export default CreateComponents;
