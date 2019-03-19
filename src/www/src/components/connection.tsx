import * as React from "react";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import styled from "styled-components";
import { openVpn, OpenVPN } from "../openvpn";
import CommandsContext from "./commands-context";
import { Loading } from "./loading";

const Input = styled.input`
  color: black;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 1px solid gray;
`;

const Button = styled.button`
  color: white;
  font-size: 1em;
  margin: 0.1em;
  padding: 0.25em 1em;
  &:disabled {
    background-color: gray;
  }
`;

const ConnectButton = styled(Button)`
  background-color: green;
`;

const DisconnectButton = styled(Button)`
  background-color: red;
`;

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
      <React.Fragment>
        <label>
          Host:
          <Input
            type="text"
            value={this.state.host}
            onChange={(e) => this.handleHostChange(e)}
          />
        </label>
        <label>
          Port:
          <Input
            type="number"
            value={this.state.port}
            onChange={(e) => this.handlePortChange(e)}
          />
        </label>
        <ConnectButton
          onClick={() => this.connect()}
          disabled={!!(status & (Status.Connected | Status.Connecting))}
        >
          Connect
        </ConnectButton>
        <DisconnectButton
          onClick={() => this.disconnect()}
          disabled={!!(status & (Status.Disconnected | Status.Connecting))}
        >
          Disconnect
        </DisconnectButton>
        {status === Status.Connecting && <Loading />}
      </React.Fragment>
    );
  }
}
