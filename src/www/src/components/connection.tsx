import * as React from "react";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { openVpn, OpenVPN } from "../openvpn";
import CommandsContext from "./commands-context";
import {
  ConnectButton,
  DisconnectButton,
  Input,
  Wrapper
} from "./connection.style";
import { Loading } from "./loading";

enum Status {
  Disconnected = 1,
  Connected = 2,
  Connecting = 4
}

interface Props {
  onConnected: (state: boolean) => void;
}
interface State {
  status: Status;
  host: string;
  port: number;
  error: string;
}

export class ConnectionForm extends React.Component<Props, State> {
  public static contextType = CommandsContext;
  public static defaultState: State = {
    status: Status.Disconnected,
    host: "10.8.0.1",
    port: 5555,
    error: ""
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

  public handleHostChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ host: event.target.value });
  }

  public handlePortChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ port: parseInt(event.target.value, 10) });
  }

  public connect() {
    const { commandsSource } = this.context;
    this.setState({ status: Status.Connecting });
    this.openVPN
      .connect(this.state.host, this.state.port)
      .pipe(
        tap((commands) => commandsSource.next(commands)),
        tap(() => this.setState({ status: Status.Connected }))
      )
      .subscribe({
        error: ({ message }: Error) =>
          this.setState({ error: message, status: Status.Disconnected }),
        complete: () => this.props.onConnected(true)
      });
  }

  public disconnect() {
    this.openVPN.disconnect();
  }

  public render() {
    const { status } = this.state;

    return (
      <Wrapper>
        {!(status & Status.Connected) && (
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
        {!!(status & Status.Connected) && (
          <DisconnectButton onClick={() => this.disconnect()}>
            Disconnect
          </DisconnectButton>
        )}
        {status === Status.Connecting && <Loading />}
      </Wrapper>
    );
  }
}
