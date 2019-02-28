import * as React from "react";
import styled from "styled-components";
import { Commands } from "../openvpn";
import { mergeMap } from "rxjs/operators";
import { Subscription, interval } from "rxjs";
import CommandsContext from "./commands-context";

const StatusText = styled.ul`
  list-style-type: none;
`;

interface Props {}
interface State {
  status: string[];
}

export class Status extends React.Component<Props, State> {
  static contextType = CommandsContext;
  private subscription: Subscription = undefined;

  constructor(props: Props) {
    super(props);
    this.state = { status: [] };
  }

  componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(
        mergeMap(({ status }: Commands) =>
          interval(1000).pipe(mergeMap(() => status))
        )
      )
      .subscribe({
        next: (status: string[]) => this.setState({ status })
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
