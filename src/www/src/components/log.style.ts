import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  text-align: start;
  border: 1px solid #505050;
  padding: 5px;
  background: rgba(51, 51, 51, 0.75);
`;

export const Title = styled.p`
  display: inline-flex;
  margin: 0px 10px 10px 0px;
`;

export const LogSwitch = styled.button<{ enabled: boolean }>`
  background: ${(props) => (props.enabled ? "#b30000" : "#007b00")};
  border: 1px solid #505050;
  color: white;
`;

export const Logs = styled.textarea`
  display: flex;
  color: whitesmoke;
  background: rgb(33, 33, 33);
  box-sizing: border-box;
  border: 0;
  width: 100%;
  height: 100%;
  resize: none;
`;
