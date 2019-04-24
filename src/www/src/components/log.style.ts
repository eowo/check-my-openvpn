import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  text-align: start;
`;

export const Title = styled.p`
  display: inline-flex;
  margin: 0px 10px 10px 0px;
`;

export const LogSwitch = styled.button<{ enabled: boolean }>`
  background: ${(props) => (props.enabled ? "red" : "#007b00")};
  border: 1px solid black;
  color: white;
`;

export const Logs = styled.textarea`
  display: flex;
  background: rgba(51, 51, 51, 0.75);
  color: whitesmoke;
  box-sizing: border-box;
  border: 0;
  width: 100%;
  height: 100%;
  resize: none;
`;
