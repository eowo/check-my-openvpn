import * as React from "react";
import styled from "styled-components";
import { openVpnConnection, OpenVPNConnection } from "../openvpn";

const Input = styled.input`
  color: black;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const Button = styled.button`
  color: white;
  font-size: 1em;
  margin: 0.1em;
  padding: 0.25em 1em;
  border: 2px solid gray;
  border-radius: 3px;
`;

const ConnectBtn = styled(Button)`
  background-color: green;
`;

const DisconnectBtn = styled(Button)`
  background-color: red;
`;

export class ConnectionForm extends React.Component {
  private inputRef: React.RefObject<HTMLInputElement>;
  private openVPNConnection: OpenVPNConnection;

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.openVPNConnection = openVpnConnection();
  }

  connect() {
    this.openVPNConnection.connect("10.8.0.1", 5555);
  }

  disconnect() {
    this.openVPNConnection.disconnect();
  }

  render() {
    return (
      <React.Fragment>
        <Input
          ref={this.inputRef}
          onMouseEnter={() => {
            this.inputRef.current!.focus();
          }}
        />
        <ConnectBtn onClick={() => this.connect()}>Connect</ConnectBtn>
        <DisconnectBtn onClick={() => this.disconnect()}>
          Disconnect
        </DisconnectBtn>
      </React.Fragment>
    );
  }
}
