import * as React from "react";
import styled from "styled-components";

const Wrapper = styled.dl`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  margin: 0;
`;

const P = styled.dt`
  width: 40%;
  text-align: right;
  font-weight: 600;
`;
const V = styled.dd`
  width: 55%;
  margin: 0;
  text-align: left;
  font-weight: 500;
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
      <P>commonName:</P>
      <V>{commonName}</V>
      <P>realAddress:</P>
      <V>{realAddress}</V>
      <P>virtualAddress:</P>
      <V>{virtualAddress}</V>
      <P>virtualIPv6Address:</P>
      <V>{virtualIPv6Address}</V>
      <P>bytesReceived:</P>
      <V>{bytesReceived}</V>
      <P>bytesSent:</P>
      <V>{bytesSent}</V>
      <P>connectedSince:</P>
      <V>{connectedSince}</V>
      <P>connectedSinceTimeT:</P>
      <V>{connectedSinceTimeT}</V>
      <P>username:</P>
      <V>{username}</V>
      <P>clientId:</P>
      <V>{clientId}</V>
      <P>peerId:</P>
      <V>{peerId}</V>
    </Wrapper>
  )
);
