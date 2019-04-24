import { test } from "ramda";
import * as React from "react";
import { forkJoin, of, Subscription, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import styled from "styled-components";
import { Client } from "./client";
import CommandsContext from "./commands-context";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: 1 1 auto;
  overflow-y: auto;
  height: 60vh;
`;

interface State {
  status: string[];
}

export class Status extends React.Component<{}, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private subscription: Subscription = undefined;

  constructor(props: {}) {
    super(props);
    this.state = { status: [] };
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(
        switchMap(({ status, bytecountRequest }) =>
          forkJoin(of(status), bytecountRequest(1))
        ),
        switchMap(([status]) => timer(0, 5000).pipe(switchMap(() => status)))
      )
      .subscribe((status) => this.setState({ status }));
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <Wrapper>
        {this.state.status
          .filter(test(/^CLIENT_LIST,/))
          .map((line: string) => ({ cid: line.split(",")[10], info: line }))
          .map(({ cid, info }) => (
            <Client key={cid} info={info} />
          ))}
      </Wrapper>
    );
  }
}
