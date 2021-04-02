import React, { useState, Fragment } from "react";
import styled, { css } from 'styled-components';
import ButtonCustom from '../Button';
import NFT from '../NFT';
import { Form, Input, Checkbox } from 'antd';

interface mediaTypeState {
  [key: string]: string
  image: string
  video: string
  audio: string
  text: string
  file: string
  url: string
}

interface Props {
	setIsCreate: (value: boolean) => void
}

const CreateComponents: React.FC<Props> = ({
  setIsCreate
}) => {

  const [step, setStep] = useState<number>(0)
  const [mediaType, setMediaType] = useState<string>('image')
  const [mediaUrl, setMediaUrl] = useState<string>('')
  const [formNameAndDescription] = Form.useForm();
  const [formPricingAndFees] = Form.useForm();

  const mediaPlaceholder: mediaTypeState = {
    image: `You can drag and drop your file here.\n.png, .jpg, and .gif are supported`,
    video: `You can drag and drop your file here.\n.mp4, and .mov are supported`,
    audio: `You can drag and drop your file here.\n.mp3, and .wav are supported`,
    text: `You can drag and drop your file here.\n.txt, and .md are supported`,
    file: `You can drag and drop your file here.\n.pdf, .psd, and .ai are supported`,
    url: ``,
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <StyledWrapper>
      <StyledContainer>
        <StyledContainerGrid>
          <StyledContainerGridCol start="0" end="6">
            <StyledTitle>Create Media</StyledTitle>
            {
              step === 0 ?
                <Fragment>
                  <StyledSubtitle>Upload</StyledSubtitle>
                  <StyledMultiiMediaInput>
                    <StyledMultiiMediaInputHead>
                      <StyledMultiiMediaInputHeadTab actions={mediaType === 'image'} onClick={() => setMediaType('image')}>Image</StyledMultiiMediaInputHeadTab>
                      <StyledMultiiMediaInputHeadTab actions={mediaType === 'video'} onClick={() => setMediaType('video')}>Video</StyledMultiiMediaInputHeadTab>
                      <StyledMultiiMediaInputHeadTab actions={mediaType === 'audio'} onClick={() => setMediaType('audio')}>Audio</StyledMultiiMediaInputHeadTab>
                      <StyledMultiiMediaInputHeadTab actions={mediaType === 'text'} onClick={() => setMediaType('text')}>Text</StyledMultiiMediaInputHeadTab>
                      <StyledMultiiMediaInputHeadTab actions={mediaType === 'file'} onClick={() => setMediaType('file')}>File</StyledMultiiMediaInputHeadTab>
                      <StyledMultiiMediaInputHeadTab actions={mediaType === 'url'} onClick={() => setMediaType('url')}>URL</StyledMultiiMediaInputHeadTab>
                    </StyledMultiiMediaInputHead>
                    {
                      mediaType !== 'url' ?
                        <StyledMultiiMediaInputWrapper>
                          <p>{mediaPlaceholder[mediaType]}</p>
                        </StyledMultiiMediaInputWrapper> :
                        // bottom, type is url show
                        <StyledMultiiMediaInputContainer>
                          <label className="label">Enter URL</label>
                          <input type="text" className="input" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}></input>
                        </StyledMultiiMediaInputContainer>
                    }
                  </StyledMultiiMediaInput>
                  <StyledMultiiMediaActions>
                    <ButtonCustom color="gray" onClick={ () => setIsCreate(false) }>Back</ButtonCustom>
                    <ButtonCustom color="dark" disabled={false} onClick={() => setStep(1)}>Continue</ButtonCustom>
                  </StyledMultiiMediaActions>
                </Fragment> :
                step === 1 ?
                  <Fragment>
                    <StyledSubtitle>Add information</StyledSubtitle>
                    <StyledMultiiMediaForm
                      name="nameAndDescription"
                      form={formNameAndDescription}
                      layout="vertical"
                      initialValues={{}}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <StyledMultiiMediaFormItem className="input">
                        <Form.Item
                          label="Name"
                          name="name"
                          rules={[{ required: true, message: 'Name is required' }]}
                        >
                          <Input placeholder="Enter Name" className="input-name" />
                        </Form.Item>

                        <Form.Item
                          label="Description"
                          name="description"
                          rules={[{ required: true, message: 'Description is required' }]}
                        >
                          <Input.TextArea placeholder="Enter Description" className="input-textarea" />
                        </Form.Item>
                      </StyledMultiiMediaFormItem>
                      <StyledMultiiMediaFormItem className="footer">
                        <ButtonCustom color="gray" onClick={() => setStep(0)}>Back</ButtonCustom>
                        <ButtonCustom color="dark" disabled={false} onClick={() => setStep(2)} type="submit">Continue</ButtonCustom>
                      </StyledMultiiMediaFormItem>
                    </StyledMultiiMediaForm>
                  </Fragment> :
                  step === 2 ?
                    <Fragment>
                      <StyledSubtitle>Pricing & fees</StyledSubtitle>
                      <StyledMultiiMediaForm
                        name="pricingAndFees"
                        form={formPricingAndFees}
                        layout="vertical"
                        initialValues={{}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                      >
                        <StyledMultiiMediaFormItem className="input">
                          <Form.Item
                            label="Resale royalty"
                            name="name"
                            rules={[{ required: true, message: 'Creator share percentage is required' }]}
                          >
                            <StyledMultiiMediaFormItemText>A percentage fee that you receive for all secondary sales of this piece.</StyledMultiiMediaFormItemText>
                            <Input placeholder="Enter percentage" className="input-name" />
                          </Form.Item>
                        </StyledMultiiMediaFormItem>
                        <StyledMultiiMediaFormItem className="footer">
                          <ButtonCustom color="gray" onClick={() => setStep(1)}>Back</ButtonCustom>
                          <ButtonCustom color="dark" disabled={false} onClick={() => alert('success')} type="submit">Continue</ButtonCustom>
                        </StyledMultiiMediaFormItem>
                      </StyledMultiiMediaForm>
                    </Fragment> : ''
            }
          </StyledContainerGridCol>
          <StyledContainerGridCol start="7" end="12">
            <StyledSubtitle>Preview</StyledSubtitle>
            <div style={{ width: '100%', minHeight: '133%' }}>
              <NFT></NFT>
            </div>
          </StyledContainerGridCol>
        </StyledContainerGrid>
      </StyledContainer>
    </StyledWrapper>
  )
}

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
`
const StyledHead = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const StyledContainer = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(1246px);
`
const StyledContainerGrid = styled.div`
  width: 100%;
  display: inline-grid;
  column-gap: 30px;
  grid-template-columns: repeat(12, 1fr);
`
const StyledContainerGridCol = styled.div<{ start?: string, end?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  ${props => (props.start && props.end) && css`
      height: auto;
      grid-column: ${Number(props.start) + 1} / ${Number(props.end) + 1};
    `
  }
`
const StyledTitle = styled.h2`
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 50px;
  margin-top: 0;
  color: #000;
`
const StyledSubtitle = styled.h4`
  font-weight: 500;
  margin-bottom: 25px;
  font-size: 20px;
  margin-top: 0px;
  color: #000;
`
const StyledMultiiMediaInput = styled.div`
  width: 100%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 20px 0px 0px;
`
const StyledMultiiMediaInputHead = styled.div`
  color: #000;
  width: auto;
  padding: 0px 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const StyledMultiiMediaInputHeadTab = styled.h5<{ actions?: Boolean }>`
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
    content: "";
    position: absolute;
    height: 2px;
    width: 100%;
    left: 0px;
    right: 0px;
    bottom: -17px;
  }
  ${props => props.actions && css`
      color: rgb(0, 0, 0);
      font-weight: 600;
      &::after {
        background: rgb(0, 0, 0);
      }
    `
  }
  &:hover {
    color: rgb(0, 0, 0);
    &::after {
      background: rgb(0, 0, 0);
    }
  }
`
const StyledMultiiMediaInputWrapper = styled.div`
  width: auto;
  height: 100px;
  margin: 20px;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
`
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
`
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
`

const StyledMultiiMediaForm = styled(Form)`
width: 100%;
`
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
`
const StyledMultiiMediaFormItemText = styled.p`
  font-size: 17px;
  font-weight: 400;
  margin-top: 0px;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
  line-height: 1.15;
`
export default CreateComponents