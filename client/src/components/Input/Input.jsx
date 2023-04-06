import styled from "styled-components";

const StyledInput = styled.input`
    font-size: 14px;
    border-radius: 4px;
    padding: 16px 40px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    background-color: #cdedfc;
    margin-top: 8px;
    border: none;
    outline: none;
    justify-content: center;

    ::placeholder {
      color: #272727;
      font-size: 12px;
    }
`;

const Input = (props) => {
  return (
    <StyledInput {...props} />
  )
}


export default Input;