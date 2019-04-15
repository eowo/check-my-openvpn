import { equals } from "ramda";
import * as React from "react";
import { Subscription } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { ClientInfo } from "./client-info";
import { Graphs, Info, Wrapper } from "./client.style";
import CommandsContext from "./commands-context";
import { PathTransitionGraph } from "./path-transition";

interface ClientData {
  commonName: string;
  realAddress: string;
  virtualAddress: string;
  virtualIPv6Address: string;
  bytesReceived: number;
  bytesSent: number;
  connectedSince: string;
  connectedSinceTimeT: string;
  username: string;
  clientId: number;
  peerId: string;
}

interface Props {
  info: string;
}

interface State {
  bytesSent: number;
  bytesReceived: number;
}

export class Client extends React.Component<Props, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private subscription: Subscription = undefined;
  private clientData: ClientData;

  constructor(props: Props) {
    super(props);
    this.state = { bytesSent: 0, bytesReceived: 0 };
    this.clientData = parseClientInfo(this.props.info);
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(
        switchMap(({ bytecount }) => bytecount),
        filter(({ cid }) => cid === this.clientData.clientId)
      )
      .subscribe(({ bytesIn, bytesOut }) =>
        this.setState({ bytesReceived: bytesIn, bytesSent: bytesOut })
      );
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (!equals(this.props, nextProps)) {
      this.clientData = parseClientInfo(nextProps.info);
    }

    if (!equals(this.state, nextState)) {
      return true;
    }

    return false;
  }

  public render() {
    return (
      <Wrapper>
        <Info>
          <ClientInfo {...this.clientData} />
        </Info>
        <Graphs>
          <PathTransitionGraph
            id={`${this.clientData.clientId}-out`}
            bytes={this.state.bytesSent}
            color="red"
          />
          <PathTransitionGraph
            id={`${this.clientData.clientId}-in`}
            bytes={this.state.bytesReceived}
            color="green"
          />
        </Graphs>
      </Wrapper>
    );
  }
}

const parseClientInfo = (info: string): ClientData => {
  const [
    ,
    commonName,
    realAddress,
    virtualAddress,
    virtualIPv6Address,
    bytesReceived,
    bytesSent,
    connectedSince,
    connectedSinceTimeT,
    username,
    clientId,
    peerId
  ] = info.split(",");

  return {
    commonName,
    realAddress,
    virtualAddress,
    virtualIPv6Address,
    bytesReceived: parseInt(bytesReceived, 10),
    bytesSent: parseInt(bytesSent, 10),
    connectedSince,
    connectedSinceTimeT,
    username,
    clientId: parseInt(clientId, 10),
    peerId
  };
};
