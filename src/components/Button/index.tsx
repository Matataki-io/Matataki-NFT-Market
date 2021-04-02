import styled, { css } from 'styled-components';

interface ButtonProps {
  children?: React.ReactNode,
  disabled?: boolean,
  onClick?: () => void,
  color?: string
  className?: string
  type?: "button" | "submit" | "reset" | undefined
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  color,
  className,
	type
}) => {
  return (
    <StyledButton
      disabled={ disabled }
      onClick={onClick}
      color={ color }
      className={ className }
      type={ type }
    >
      { children }
    </StyledButton>
  )
}

const StyledButton = styled.button<{ color?: string }>`
	line-height: 20px;
	border: none;
	outline: none;
	cursor: pointer;
	transition: all .2s;
	padding: 10px 15px;
	margin: 5px;
	font-weight: 500;
	font-size: 14px;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	cursor: pointer;
	text-decoration: none;
	white-space: nowrap;
	appearance: none;
	color: #000;
  background: transparent;
	/* &:hover {
		background: transparent;
	} */
	${ props => props.color === 'dark' && css`
		color: #FFFFFF;
		background: rgb(0, 0, 0);
		&:hover {
			background: rgb(64, 64, 64);
		}
	`}
	${ props =>props.color === 'gray' && css`
		color: rgb(0, 0, 0);
    background: rgb(230, 230, 230);
		&:hover {
      border-color: rgb(0, 0, 0);
		}
	`}

	&[disabled] {
    cursor: not-allowed;
    background: rgb(128, 128, 128);
    color: rgb(255, 255, 255);
}

	&.hover-underline {
		&:hover {
			text-decoration: underline;
		}
	}
`

export default Button