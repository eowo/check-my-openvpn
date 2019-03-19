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
    font-size: 1.1em;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  font-weight: bold;
  text-align: center;
  & > * {
    padding: 10px;
  }
`;

export const Header = styled.div`
  background: tomato;
`;

export const Footer = styled.div`
  background: lightgreen;
`;

export const Main = styled.div`
  flex: auto;
  text-align: left;
  background: white;
`;
