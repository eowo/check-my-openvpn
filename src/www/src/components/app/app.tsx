import * as React from "react";
import { ConnectionForm } from "../connection";
import { Log } from "../log";
import { OpenVPN } from "../openvpn";
import { Status } from "../status";
import { Version } from "../version";
import { Footer, GlobalStyle, Header, Logo, Main, Wrapper } from "./app.style";

interface State {
  connected: boolean;
}
export class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { connected: false };
  }

  public render() {
    return (
      <Wrapper>
        <GlobalStyle />
        <Header>
          <Logo />
        </Header>
        <Main>
          <ConnectionForm
            onConnected={(connected) => this.setState({ connected })}
          />
          {this.state.connected && (
            <React.Fragment>
              <OpenVPN />
              <Status />
              <Log />
            </React.Fragment>
          )}
        </Main>
        <Footer>
          <Version />
        </Footer>
      </Wrapper>
    );
  }
}
