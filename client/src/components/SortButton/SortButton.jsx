import { midnightGreen, mintCream } from "../../assets/consts/colors";

import styled from "styled-components";

const SortButton = ({ children, ...rest }) => {
  return (
      <Button {...rest}>{children}</Button>
  )
}

export default SortButton;

const Button = styled.button`
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    color: ${mintCream};
    background-color: ${midnightGreen};
`;