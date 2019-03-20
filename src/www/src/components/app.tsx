import * as React from "react";
import { Footer, GlobalStyle, Header, Main, Wrapper } from "./app.style";
import { ConnectionForm } from "./connection";
import { Log } from "./log";
import { Pid } from "./pid";
import { Status } from "./status";

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
        <Header>CheckMyOpenVPN</Header>
        <Main>
          <ConnectionForm
            onConnected={(connected) => this.setState({ connected })}
          />
          {this.state.connected && (
            <React.Fragment>
              <Pid />
              <Status />
              <Log />
            </React.Fragment>
          )}
        </Main>
        <Footer />
      </Wrapper>
    );
  }
}
