import React, { DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface TextareaProps
  extends Omit<
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'ref'
  > {
  optional?: boolean;
}

const Textarea: React.FC<TextareaProps> = props => {
  const { name = 'input', optional = false } = props;
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
      <StyledTextarea {...props} id={formName} name={formName} />
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

const StyledTextarea = styled.textarea`
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
`;

export default Textarea;
