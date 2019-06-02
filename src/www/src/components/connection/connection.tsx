import * as React from "react";
import { race, Subscription } from "rxjs";
import { mergeMap, switchMap, take, takeWhile, tap } from "rxjs/operators";
import { openVpn, OpenVPN } from "../../openvpn";
import { STATES } from "../../openvpn/real-time-messages";
import CommandsContext from "../commands-context";
import { Loading } from "../loading";
import {
  ConnectButton,
  DisconnectButton,
  Input,
  LoginButton,
  Wrapper
} from "./connection.style";

enum Status {
  Disconnected = 1,
  Connected = 2,
  Connecting = 3,
  PasswordRequired = 4
}

interface Props {
  onConnected: (state: boolean) => void;
}
interface State {
  status: Status;
  host: string;
  port: number;
  error: string;
  password: string;
  loginBtnShake: boolean;
}

const isConnected = (value: any) =>
  value === STATES.SUCCESS || /^INFO:/.test(value);

export class ConnectionForm extends React.Component<Props, State> {
  public static contextType = CommandsContext;
  public static defaultState: State = {
    status: Status.Disconnected,
    host: "10.8.0.1",
    port: 5555,
    error: "",
    password: "",
    loginBtnShake: false
  };
  public context!: React.ContextType<typeof CommandsContext>;
  private openVPN: OpenVPN;
  private eventsSubscription: Subscription = undefined;

  constructor(props: Props) {
    super(props);
    this.state = ConnectionForm.defaultState;
    this.openVPN = openVpn();
  }

  public componentDidMount() {
    this.eventsSubscription = this.openVPN.events.subscribe({
      next: ({ closed }) => {
        this.setState({
          status: closed ? Status.Disconnected : Status.Connected
        });
        this.props.onConnected(!closed);
      }
    });
  }

  public componentWillUnmount() {
    this.eventsSubscription.unsubscribe();
  }

  public handleHostChange({
    target: { value: host }
  }: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ host });
  }

  public handlePortChange({
    target: { value: port }
  }: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ port: parseInt(port, 10) });
  }

  public handlePasswordChange({
    target: { value: password }
  }: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password });
  }

  public login() {
    const { commandsSource } = this.context;
    commandsSource
      .pipe(
        take(1),
        tap(() => this.setState({ loginBtnShake: false })),
        mergeMap(({ sendMsg }) => sendMsg(this.state.password))
      )
      .subscribe();
  }

  public connect() {
    const { commandsSource } = this.context;
    this.setState({ status: Status.Connecting });
    this.openVPN
      .connect(this.state.host, this.state.port)
      .pipe(
        tap((commands) => commandsSource.next(commands)),
        switchMap(({ managementPassword, info }) =>
          race([managementPassword, info]).pipe(
            takeWhile((res: STATES | string) => !isConnected(res), true),
            tap((state: STATES | string) => {
              if (state === STATES.REQUEST) {
                this.setState({
                  password: "",
                  loginBtnShake: true,
                  status: Status.PasswordRequired
                });
              } else {
                this.setState({ status: Status.Connected });
                this.props.onConnected(true);
              }
            })
          )
        )
      )
      .subscribe({
        error: ({ message }: Error) =>
          this.setState({ error: message, status: Status.Disconnected })
      });
  }

  public disconnect() {
    this.openVPN.disconnect();
  }

  public render() {
    const { status } = this.state;

    return (
      <Wrapper connected={!!(status & Status.Connected)}>
        {status === Status.Disconnected && (
          <React.Fragment>
            <Input
              required
              placeholder="Host"
              type="text"
              value={this.state.host}
              onChange={(e) => this.handleHostChange(e)}
            />
            <Input
              required
              placeholder="Port"
              type="number"
              value={this.state.port}
              onChange={(e) => this.handlePortChange(e)}
            />
            <ConnectButton onClick={() => this.connect()}>
              Connect
            </ConnectButton>
          </React.Fragment>
        )}
        {status === Status.PasswordRequired && (
          <React.Fragment>
            <Input
              autoFocus
              required
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={(e) => this.handlePasswordChange(e)}
              onKeyPress={(e) => {
                if (e.key === "Enter") this.login();
              }}
            />
            <LoginButton
              animation={this.state.loginBtnShake}
              onClick={() => this.login()}
            >
              Login
            </LoginButton>
          </React.Fragment>
        )}
        {status === Status.Connected && (
          <DisconnectButton onClick={() => this.disconnect()}>
            Disconnect
          </DisconnectButton>
        )}
        {status === Status.Connecting && <Loading />}
      </Wrapper>
    );
  }
}
