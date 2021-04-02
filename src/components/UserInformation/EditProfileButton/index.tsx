import { Modal } from '@geist-ui/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { IconClose } from '../../Icons';
import Input from './components/Input';
import Textarea from './components/Textarea';
import ProfileImageInput from './components/ProfileImageInput';
import style from './Modal.module.scss';

const EditProfileButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <StyledWrapper>
      <StyledEditButton onClick={handleModalOpen}>
        Edit profile
      </StyledEditButton>
      <Modal
        width='470px'
        wrapClassName={style.modalWrap}
        open={isModalOpen}
        onClose={handleModalClose}>
        <StyledModalTitle>
          Complete your profile
          <StyledModalTitleClose onClick={handleModalClose}>
            <IconClose />
          </StyledModalTitleClose>
        </StyledModalTitle>
        <StyledModalContent>
          <StyledForm>
            <ProfileImageInput />
            <Input name='name' placeholder='Enter your name' />
            <Input name='username' placeholder='Enter your username' />
            <Textarea name='bio' optional />
            <Input name='website' optional />
            <StyledButtonRoot>
              <StyledSubmitButton type='submit' role='button'>
                Save
              </StyledSubmitButton>
            </StyledButtonRoot>
          </StyledForm>
        </StyledModalContent>
      </Modal>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-top: 20px;
`;

const StyledEditButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  margin: 0px 5px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(0, 0, 0);
  background-color: rgb(230, 230, 230);
  border: 1px solid transparent;
  &:hover {
    background-color: rgb(230, 230, 230);
    border-color: rgb(0, 0, 0);
  }
`;

const StyledModalTitle = styled.h5`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: auto;
  font-size: 14px;
  font-weight: 500;
  padding: 20px;
  margin-bottom: 0px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const StyledModalTitleClose = styled.div`
  width: 16px;
  height: 16px;
  padding: 10px;
  margin: -10px;
  cursor: pointer;
  box-sizing: content-box;
`;

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  height: 100%;
  padding: 20px;
`;

const StyledForm = styled.div`
  width: 100%;
`;

const StyledButtonRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-top: 20px;
`;

const StyledSubmitButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
  margin: 0px 5px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  color: rgb(255, 255, 255);
  background-color: rgb(0, 0, 0);
  border: 2px solid transparent;
  &:last-child {
    margin-right: 0px;
  }
  &:first-child {
    margin-left: 0px;
  }
  &[disabled] {
    cursor: not-allowed;
    background-color: rgb(128, 128, 128);
    color: rgb(255, 255, 255);
  }
  &:hover {
    background-color: rgb(64, 64, 64);
  }
`;

export default EditProfileButton;
