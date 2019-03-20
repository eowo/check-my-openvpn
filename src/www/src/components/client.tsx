import * as React from "react";
import { ClientInfo } from "./client-info";
import { Graphs, Info, Wrapper } from "./client.style";
import { PathTransitionGraph } from "./path-transition";

interface Props {
  info: string;
}

export const Client = ({ info }: Props) => {
  const client = parseClientInfo(info);

  return (
    <Wrapper>
      <Info>
        <ClientInfo {...client} />
      </Info>
      <Graphs>
        <PathTransitionGraph
          id={`${client.clientId}-out`}
          bytes={client.bytesSent}
          color="red"
        />
        <PathTransitionGraph
          id={`${client.clientId}-in`}
          bytes={client.bytesReceived}
          color="green"
        />
      </Graphs>
    </Wrapper>
  );
};

const parseClientInfo = (info: string) => {
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
    clientId,
    peerId
  };
};
