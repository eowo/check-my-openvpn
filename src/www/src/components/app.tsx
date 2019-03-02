import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Commands } from "../openvpn";
import { ConnectionForm } from "./connection";
import { Log } from "./log";
import { Pid } from "./pid";
import { Status } from "./status";

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

interface Props {}
interface State {}

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.setCommands.bind(this);
  }

  public setCommands(commands: Commands) {
    this.setState({ commands });
  }

  public render() {
    return (
      <React.Fragment>
        <GlobalStyle light />
        <Title>CheckMyOpenVpn</Title>
        <ConnectionForm />
        <Pid />
        <Status />
        <Log />
      </React.Fragment>
    );
  }
}
