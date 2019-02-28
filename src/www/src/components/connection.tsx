import * as React from "react";
import styled from "styled-components";
import { openVpn, OpenVPN } from "../openvpn";
import { Loading } from "./loading";
import CommandsContext from "./commands-context";

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
  Disconnected,
  Connected,
  Connecting
}

interface Props {}
interface State {
  status: Status;
  host: string;
  port: number;
}

export class ConnectionForm extends React.Component<Props, State> {
  static contextType = CommandsContext;
  static defaultState: State = {
    status: Status.Disconnected,
    host: "10.8.0.1",
    port: 5555
  };

  private openVPN: OpenVPN;

  constructor(props: Props) {
    super(props);
    this.state = ConnectionForm.defaultState;
    this.openVPN = openVpn();
  }

  handleHostChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ host: event.target.value });
  }

  handlePortChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ port: parseInt(event.target.value) });
  }

  connect() {
    const { commandsSource } = this.context;
    this.setState({ status: Status.Connecting });
    this.openVPN.connect(this.state.host, this.state.port).subscribe({
      next: commands => {
        commandsSource.next(commands);
      },
      error: e => this.setState({ status: Status.Disconnected }),
      complete: () => this.setState({ status: Status.Connected })
    });
  }

  disconnect() {
    this.openVPN.disconnect();
    this.setState(ConnectionForm.defaultState);
  }

  render() {
    const { status } = this.state;

    return (
      <React.Fragment>
        <label>
          Host:
          <Input
            type="text"
            value={this.state.host}
            onChange={this.handleHostChange}
          />
        </label>
        <label>
          Port:
          <Input
            type="number"
            value={this.state.port}
            onChange={this.handlePortChange}
          />
        </label>
        <ConnectButton
          onClick={() => this.connect()}
          disabled={status === Status.Connected || status === Status.Connecting}
        >
          Connect
        </ConnectButton>
        <DisconnectButton
          onClick={() => this.disconnect()}
          disabled={status === Status.Disconnected}
        >
          Disconnect
        </DisconnectButton>
        {status === Status.Connecting && <Loading />}
      </React.Fragment>
    );
  }
}
