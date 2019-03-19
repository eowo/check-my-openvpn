import { test } from "ramda";
import * as React from "react";
import { Subscription, timer } from "rxjs";
import { mergeMap, switchMap } from "rxjs/operators";
import { Client } from "./client";
import CommandsContext from "./commands-context";

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
        switchMap(({ status }) => timer(0, 2000).pipe(switchMap(() => status)))
      )
      .subscribe((status) => this.setState({ status }));
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <React.Fragment>
        {this.state.status
          .filter(test(/^CLIENT_LIST,/))
          .map((line: string) => ({ cid: line.split(",")[10], info: line }))
          .map(({ cid, info }) => (
            <Client key={cid} info={info} />
          ))}
      </React.Fragment>
    );
  }
}
