import styled, { css } from "styled-components";

export const Wrapper = styled.div<{ connected: boolean }>`
  background: #383838;
  border: 1px solid #505050;
  padding: 20px;
  display: inline-flex;
  flex-direction: column;
  font-size: 1.2em;
  & > input,
  button {
    outline: none;
    color: whitesmoke;
    margin: 5px;
    padding: 10px;
  }

  ${(props) =>
    props.connected &&
    css`
      position: absolute;
      display: inline-block;
      background: transparent;
      border: 0;
      top: 0;
      right: 0;
      padding: 0;
      button {
        padding: 5px;
      }
    `}
`;

export const Input = styled.input`
  border: none;
  background-color: transparent;
  border-bottom: 1px solid #505050;

  ::placeholder {
    color: whitesmoke;
    font-size: 1.2em;
  }
`;

export const Button = styled.button`
  border: 1px solid #505050;
  border-radius: 3px;
  &:disabled {
    background-color: #525252;
    color: #a5a5a5;
  }
`;

export const ConnectButton = styled(Button)`
  background-color: #007b00;
`;

export const DisconnectButton = styled(Button)`
  background-color: #b30000;
  padding: 5px;
`;
