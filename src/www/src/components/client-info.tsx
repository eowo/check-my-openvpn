import * as React from "react";
import styled from "styled-components";

const Wrapper = styled.dl`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  margin: 0;
  text-align: left;
`;

const P = styled.dt`
  width: 40%;
`;
const V = styled.dd`
  width: 55%;
  margin: 0;
  color: #aaa;
  font-weight: 400;
`;

interface Props {
  commonName: string;
  realAddress: string;
  virtualAddress: string;
  virtualIPv6Address: string;
  bytesReceived: number;
  bytesSent: number;
  connectedSince: string;
  connectedSinceTimeT: string;
  username: string;
  clientId: string;
  peerId: string;
}

export const ClientInfo = React.memo(
  ({
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
  }: Props) => (
    <Wrapper>
      <P>Common Name:</P>
      <V>{commonName}</V>
      <P>Real Address:</P>
      <V>{realAddress}</V>
      <P>Virtual Address:</P>
      <V>{virtualAddress}</V>
      <P>Virtual IPv6 Address:</P>
      <V>{virtualIPv6Address}</V>
      <P>Received:</P>
      <V>{bytesToMib(bytesReceived).toFixed(2)} MiB</V>
      <P>Sent:</P>
      <V>{bytesToMib(bytesSent).toFixed(2)} MiB</V>
      <P>Connected since:</P>
      <V>{connectedSince}</V>
      <P>Username:</P>
      <V>{username}</V>
      <P>Client Id:</P>
      <V>{clientId}</V>
      <P>Peer Id:</P>
      <V>{peerId}</V>
    </Wrapper>
  )
);

const bytesToMib = (b: number) => b / Math.pow(1024, 2);
