import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Roboto-Light";
    src: url("font/Roboto-Light.ttf");
  }
  body {
    padding: 0px;
    margin: 0px;
    font-family: 'Roboto-Light';
    font-size: 1em;
    color: whitesmoke;
    background: #1e1e1e;
    * > button, input, textarea {
      font-size: 1em;
    }
  }
`;

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  font-weight: bold;
  text-align: center;
`;

export const Header = styled.div`
  height: auto;
  background: #424242;
`;

export const Footer = styled.div`
  height: 5vh;
  background: #424242;
`;

export const Main = styled.div`
  flex: auto;
  & > * {
    margin: 10px;
  }
`;
