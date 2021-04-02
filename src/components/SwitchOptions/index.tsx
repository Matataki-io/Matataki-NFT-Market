import React, { useState } from 'react';
import styled from 'styled-components';

export type SwitchOptionsOnChangeParam<T> = {
  option: T;
  index: number;
};

export interface SwitchOptionsProps<T = string> {
  options: readonly T[];
  onChange: (param: SwitchOptionsOnChangeParam<T>) => void;
}

function SwitchOptions<T>(props: SwitchOptionsProps<T>) {
  const { options, onChange } = props;
  const [selectedOption, setSelectedOption] = useState<T>(options[0]);
  const handleOnChange = (option: T, index: number) => {
    if (selectedOption === option) return;
    setSelectedOption(option);
    onChange({ option, index });
  };

  return (
    <StyledSwitchContainer>
      {options.map((option, index) => (
        <StyledOptions
          key={`option-${index}-${option}`}
          checked={selectedOption === option}
          onClick={() => handleOnChange(option, index)}>
          {option}
        </StyledOptions>
      ))}
    </StyledSwitchContainer>
  );
}

const StyledSwitchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  margin-bottom: 50px;
`;

type StyledOptionsProps = {
  checked: boolean;
};
const StyledOptions = styled.button<StyledOptionsProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  appearance: none;
  padding: 10px;
  margin: 30px 0px 0px;
  font-size: 15px;
  color: ${props => (props.checked ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')};
  background-color: ${props =>
    props.checked ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'};
  border: 2px solid ${props => (props.checked ? 'transparent' : 'rgb(0, 0, 0)')};
  border-radius: 0;

  &:first-child {
    margin-left: 0px;
    border-right: none;
  }
  &:last-child {
    margin-right: 0px;
    border-left: none;
  }
`;

export default SwitchOptions;
