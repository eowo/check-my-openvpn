import * as React from "react";
import { Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import styled from "styled-components";
import { Commands } from "../openvpn";
import CommandsContext from "./commands-context";

const PidText = styled.div`
  color: blue;
  border-color: blue;
`;

interface PidProps {}
interface PidState {
  pid: string;
}

export class Pid extends React.Component<PidProps, PidState> {
  public static contextType = CommandsContext;
  private subscription: Subscription = undefined;

  constructor(props: PidProps) {
    super(props);
    this.state = { pid: "" };
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(mergeMap(({ pid }: Commands) => pid))
      .subscribe({
        next: (pid: string) => this.setState({ pid })
      });
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return <PidText>{this.state.pid}</PidText>;
  }
}
