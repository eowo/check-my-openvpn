import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Pid } from "./pid";
import { ConnectionForm } from "./connection";
import { Status } from "./status";
import { Log } from "./log";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props: { light: boolean }) =>
      props.light ? "white" : "black"}; 
    color: ${(props: { light: boolean }) => (!props.light ? "white" : "black")};
    font-family: 'monospace';
    font-size: 1em;
  }
`;

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: black;
`;

export const App = () => (
  <React.Fragment>
    <GlobalStyle light />
    <Title>CheckMyOpenVpn</Title>
    <ConnectionForm />
    <Pid />
    <Status />
    <Log />
  </React.Fragment>
);
