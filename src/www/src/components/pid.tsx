import * as React from "react";
import styled from "styled-components";
import { openVpnCommands, Commands } from "../openvpn";
import { mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";

const PidText = styled.div`
  color: blue;
  border-color: blue;
`;

interface PidProps {}
interface PidState {
  pid: string;
}

export class Pid extends React.Component<PidProps, PidState> {
  private subscription: Subscription = undefined;
  constructor(props: PidProps) {
    super(props);
    this.state = { pid: "" };
  }

  componentDidMount() {
    this.subscription = openVpnCommands()
      .pipe(mergeMap(({ pid }: Commands) => pid))
      .subscribe({
        next: pid => this.setState({ pid })
      });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return <PidText>{this.state.pid}</PidText>;
  }
}
