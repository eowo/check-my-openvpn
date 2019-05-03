import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Roboto-Regular";
    src: url("font/Roboto-Regular.ttf");
  }

  body {
    padding: 0px;
    margin: 0px;
    font-family: 'Roboto-Regular';
    font-size: 0.8em;
    color: whitesmoke;
    background: #1e1e1e;
    * > button, input, textarea {
      font-family: 'Roboto-Regular';
      font-size: 1em;
    }
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
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
  height: 5vh;
  background: #1a4148;
`;

export const Logo = styled.div`
  background-size: cover;
  background-image: url(./logo.png);
  width: 250px;
  height: 100%;
  background-position: center center;
`;

export const Footer = styled.div`
  height: 5vh;
  background: #424242;
  margin-top: auto;
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
`;
