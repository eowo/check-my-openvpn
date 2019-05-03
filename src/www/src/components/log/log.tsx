import * as React from "react";
import { Subscription } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { Commands } from "../../openvpn";
import CommandsContext from "../commands-context";
import { Maximize } from "../maximize";
import { Content, Header, Logs, LogSwitch, Title, Wrapper } from "./log.style";

interface State {
  enabled: boolean;
  log: string[];
  isMaximized: boolean;
}

export class Log extends React.Component<{}, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private logEnable: Commands["logEnable"] = undefined;
  private subscription: Subscription = undefined;

  constructor(props: {}) {
    super(props);
    this.state = { enabled: false, log: [], isMaximized: false };
  }

  public enableLog(on: boolean) {
    this.logEnable(on).subscribe({
      complete: () => this.setState({ enabled: on })
    });
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(
        tap(({ logEnable }) => (this.logEnable = logEnable)),
        switchMap(({ log }) => log),
        map(({ time, flag, message }) => `${time}: [${flag}] ${message}`)
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
      <Wrapper maximize={this.state.isMaximized}>
        <Header>
          <Title>Real-time output of log messages:</Title>
          <LogSwitch
            onClick={() => this.enableLog(!this.state.enabled)}
            enabled={this.state.enabled}
          >
            {!this.state.enabled ? "▶ Enable" : "◼ Disable"}
          </LogSwitch>
          <Maximize
            onChange={(maximize) => this.setState({ isMaximized: maximize })}
          />
        </Header>
        <Content>
          <Logs rows={1} value={this.state.log.join("\n")} readOnly={true} />
        </Content>
      </Wrapper>
    );
  }
}
