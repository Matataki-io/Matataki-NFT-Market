import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  > {
  optional?: boolean;
}

const Input: React.FC<InputProps> = props => {
  const { type = 'text', name = 'input', optional = false } = props;
  const formName = name?.toLowerCase();

  return (
    <StyledRoot>
      <StyledInputTitle>
        <StyledInputLabel htmlFor={formName}>
          {name.toUpperCase()}
        </StyledInputLabel>
        {optional && (
          <StyledInputOptionalLabel>Optional</StyledInputOptionalLabel>
        )}
      </StyledInputTitle>
      <StyledInput {...props} type={type} id={formName} name={formName} />
    </StyledRoot>
  );
};

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;

const StyledInputTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledInputLabel = styled.label`
  width: 100%;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
  text-align: left;
`;

const StyledInputOptionalLabel = styled.label`
  width: 100%;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  font-size: 12px;
  text-align: right;
  text-transform: none;
`;

const StyledInput = styled.input`
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
  background-color: rgba(0, 0, 0, 0.05);
  outline: none;
`;

export default Input;
