import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Avatar } from '@geist-ui/react';

export interface ProfileImageInputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  > {
  src?: string;
  address?: string;
}

const ProfileImageInput: React.FC<ProfileImageInputProps> = props => {
  const {
    name = 'profile',
    src = '',
    address = '0xFFFFFFFF...FFFFFFFF',
  } = props;
  const formName = name.toLowerCase();

  return (
    <StyledRoot>
      <StyledRow>
        <StyledAvatar src={src} size={40} />
        <StyledContent>
          <StyledAddress>{address}</StyledAddress>
          <StyledInputLabel htmlFor={formName}>
            Change profile image
            <StyledInputFile
              {...props}
              id={formName}
              type='file'
              name={formName}
              accept='image/*'
            />
          </StyledInputLabel>
        </StyledContent>
      </StyledRow>
    </StyledRoot>
  );
};

const StyledRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const StyledRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  margin: 5px !important;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 1px inset;
  height: 40px;
  width: 40px;
  background-color: rgb(0, 0, 0) !important;
  border: none !important;
`;

const StyledContent = styled.div`
  padding-left: 15px;
  flex: 0 1 auto;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledAddress = styled.p`
  font-weight: 500;
  margin-bottom: 0px;
  font-size: 14px;
  margin-top: 0px;
`;

const StyledInputLabel = styled.label`
  line-height: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.125s ease-in 0s;
  &:hover {
    color: rgb(0, 0, 0);
    text-decoration: underline;
  }
`;

const StyledInputFile = styled.input`
  display: none;
`;

export default ProfileImageInput;
