import * as React from "react";
import styled from "styled-components";
import { Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { openVpnCommands, Commands } from "../openvpn";

const Logs = styled.textarea`
  color: black;
  font-size: 1em;
`;

interface LogState {
  log: string[];
}

export class Log extends React.Component<{}, LogState> {
  private subscription: Subscription = undefined;
  constructor(props) {
    super(props);
    this.state = { log: [] };
  }

  componentDidMount() {
    this.subscription = openVpnCommands()
      .pipe(mergeMap(({ log }: Commands) => log))
      .subscribe({
        next: newLog =>
          this.setState(prevState => ({ log: [...prevState.log, newLog] }))
      });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <Logs
        rows={30}
        cols={100}
        value={this.state.log.join("\n")}
        readOnly={true}
      />
    );
  }
}
