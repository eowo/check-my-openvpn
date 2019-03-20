import styled from "styled-components";

export const Wrapper = styled.div`
  background: #383838;
  border: 1px solid #505050;
  padding: 10px;
  display: inline-flex;
  flex-direction: column;
  * > input,
  button {
    color: whitesmoke;
    margin: 2px;
    border: 1px solid #505050;
  }
`;

export const Label = styled.label`
  align-self: flex-end;
`;

export const Input = styled.input`
  background: #757575;
`;

export const Button = styled.button`
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
`;
