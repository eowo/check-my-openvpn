import * as React from "react";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import styled from "styled-components";
import CommandsContext from "./commands-context";

const Wrapper = styled.div`
  background: #383838;
  border: 1px solid #505050;
  padding: 10px;
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
    return <Wrapper>OpenVPN process ID: {this.state.pid}</Wrapper>;
  }
}
