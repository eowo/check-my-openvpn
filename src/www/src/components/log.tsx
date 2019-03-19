import * as React from "react";
import { Subscription } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import styled from "styled-components";
import { Commands } from "../openvpn";
import CommandsContext from "./commands-context";

const Wrapper = styled.div`
  flex: 1;

  background: red;
`;

const EnableLog = styled.button`
  color: black;
`;

const Logs = styled.textarea`
  box-sizing: border-box;
  font-size: 1em;
  width: 100%;
  height: 100%;
`;

interface State {
  log: string[];
}

export class Log extends React.Component<{}, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private logEnable: Commands["logEnable"] = undefined;
  private subscription: Subscription = undefined;

  constructor(props: {}) {
    super(props);
    this.state = { log: [] };
  }

  public enableLog() {
    this.logEnable(true).subscribe();
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(
        tap(({ logEnable }) => (this.logEnable = logEnable)),
        switchMap(({ log }) => log)
      )
      .subscribe((newLog: string) =>
        this.setState((prevState) => ({ log: [newLog, ...prevState.log] }))
      );
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <Wrapper>
        <EnableLog onClick={() => this.enableLog()}>Enable</EnableLog>
        <Logs
          rows={2}
          cols={2}
          value={this.state.log.join("\n")}
          readOnly={true}
        />
      </Wrapper>
    );
  }
}
