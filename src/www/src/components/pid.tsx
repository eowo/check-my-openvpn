import * as React from "react";
import styled from "styled-components";
import { mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import CommandsContext from "./commands-context";
import { Commands } from "../openvpn";

const PidText = styled.div`
  color: blue;
  border-color: blue;
`;

interface PidProps {}
interface PidState {
  pid: string;
}

export class Pid extends React.Component<PidProps, PidState> {
  static contextType = CommandsContext;
  private subscription: Subscription = undefined;

  constructor(props: PidProps) {
    super(props);
    this.state = { pid: "" };
  }

  componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(mergeMap(({ pid }: Commands) => pid))
      .subscribe({
        next: (pid: string) => this.setState({ pid })
      });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return <PidText>{this.state.pid}</PidText>;
  }
}
