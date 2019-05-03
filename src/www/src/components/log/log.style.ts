import styled, { css } from "styled-components";

const cssMaximize = css`
  position: absolute;
  width: 100vw;
  height: 90vh;
`;

export const Wrapper = styled.div<{ maximize?: boolean }>`
  flex: 1;
  flex-direction: column;
  border-top: 1px solid #505050;
  background: rgba(51, 51, 51, 1);
  margin-top: auto;
  ${(props) => (props.maximize ? cssMaximize : "")};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 25px;
`;

export const Content = styled.div`
  display: flex;
  height: calc(100% - 25px);
`;

export const Title = styled.p`
  margin: 6px;
`;

export const LogSwitch = styled.button<{ enabled: boolean }>`
  background: ${(props) => (props.enabled ? "#b30000" : "#007b00")};
  border: 1px solid #505050;
  color: white;
`;

export const Logs = styled.textarea`
  color: whitesmoke;
  background: rgb(33, 33, 33);
  box-sizing: border-box;
  border: 0;
  width: 100%;
  height: 100%;
  resize: none;
`;
