import * as React from "react";
import styled from "styled-components";
import { PathTransitionGraph } from "./path-transition";

const ClientBox = styled.div``;

interface Props {
  info: string;
}

export const Client = ({ info }: Props) => {
  const { cid, bytesIn, bytesOut } = parseClientInfo(info);
  return (
    <ClientBox>
      {info}
      <PathTransitionGraph id={`${cid}-out`} bytes={bytesOut} color="red" />
      <PathTransitionGraph id={`${cid}-in`} bytes={bytesIn} color="green" />
    </ClientBox>
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
  const cid: number = parseInt(clientId, 10);
  const bytesIn: number = parseInt(bytesReceived, 10);
  const bytesOut: number = parseInt(bytesSent, 10);

  return { cid, bytesIn, bytesOut };
};
