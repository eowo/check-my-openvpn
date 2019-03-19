import * as React from "react";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import styled from "styled-components";
import CommandsContext from "./commands-context";

const PidText = styled.div`
  color: blue;
  border-color: blue;
`;

interface State {
  pid: string;
}

export class Pid extends React.Component<{}, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private subscription: Subscription = undefined;

  constructor(props: {}) {
    super(props);
    this.state = { pid: "" };
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(switchMap(({ pid }) => pid))
      .subscribe((pid: string) => this.setState({ pid }));
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return <PidText>{this.state.pid}</PidText>;
  }
}
