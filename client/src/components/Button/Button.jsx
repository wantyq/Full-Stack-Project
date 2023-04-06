import { mainColor } from "../../assets/consts/colors";
import styled from 'styled-components';

const PrimaryButton = styled.button`
  border: none;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 16px 32px;
  background-color: ${mainColor};
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
  }
  
`;

const Button = ({ children, ...rest }) => {
    return (
        <PrimaryButton {...rest}>{children}</PrimaryButton>
    )
}

export default Button