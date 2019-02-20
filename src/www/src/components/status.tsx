import * as React from "react";
import styled from "styled-components";
import { openVpnCommands, Commands } from "../openvpn";
import { mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";

const StatusText = styled.ul`
  list-style-type: none;
`;

interface StatusProps {}
interface StatusState {
  status: string[];
}

export class Status extends React.Component<StatusProps, StatusState> {
  private subscription: Subscription = undefined;
  constructor(props: StatusProps) {
    super(props);
    this.state = { status: [] };
  }

  componentDidMount() {
    this.subscription = openVpnCommands()
      .pipe(mergeMap(({ status }: Commands) => status))
      .subscribe({
        next: status => this.setState({ status })
      });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <StatusText>
        {this.state.status.map((line: string, ix: number) => (
          <li key={ix}>{line}</li>
        ))}
      </StatusText>
    );
  }
}
