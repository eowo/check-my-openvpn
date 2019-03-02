import * as React from "react";
import { Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import styled from "styled-components";
import { Commands } from "../openvpn";
import CommandsContext from "./commands-context";

const EnableLog = styled.button`
  color: black;
`;

const Logs = styled.textarea`
  color: black;
  font-size: 1em;
`;

interface Props {}
interface State {
  log: string[];
}

export class Log extends React.Component<Props, State> {
  public static contextType = CommandsContext;

  private subscription: Subscription = undefined;
  constructor(props: Props) {
    super(props);
    this.state = { log: [] };
  }

  public enableLog() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(mergeMap(({ logEnable }: Commands) => logEnable(true)))
      .subscribe();
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(mergeMap(({ log }: Commands) => log))
      .subscribe({
        next: (newLog: string) =>
          this.setState((prevState) => ({ log: [...prevState.log, newLog] }))
      });
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <React.Fragment>
        <EnableLog onClick={() => this.enableLog()}>Enable</EnableLog>
        <Logs
          rows={30}
          cols={100}
          value={this.state.log.join("\n")}
          readOnly={true}
        />
      </React.Fragment>
    );
  }
}
