import * as React from "react";
import { forkJoin, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import styled from "styled-components";
import CommandsContext from "./commands-context";

const Wrapper = styled.dl`
  background: rgba(51, 51, 51, 0.75);
  border: 1px solid #505050;
  box-sizing: border-box;
  flex: 1;
  padding: 10px;

  display: flex;
  flex-wrap: wrap;
  text-align: left;
`;

const P = styled.dt`
  width: 10%;
`;
const V = styled.dd`
  width: 90%;
  margin: 0;
  color: #aaa;
  font-weight: 400;
`;

interface State {
  pid: string;
  version: string[];
}

export class OpenVPN extends React.Component<{}, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private subscription: Subscription = undefined;

  constructor(props: {}) {
    super(props);
    this.state = { pid: "", version: [] };
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(switchMap(({ pid, version }) => forkJoin(pid, version)))
      .subscribe(([pid, version]: [string, string[]]) =>
        this.setState({ pid, version })
      );
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <Wrapper>
        <P>Process ID:</P>
        <V>{this.state.pid}</V>
        <P>Version:</P>
        <V>{this.state.version}</V>
      </Wrapper>
    );
  }
}
