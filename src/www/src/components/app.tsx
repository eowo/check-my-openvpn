import * as React from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-family: monospace;
  font-size: 1.5em;
  text-align: center;
  color: black;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

export const App = () => (
  <Wrapper>
    <Title>CheckMyOpenVpn</Title>
  </Wrapper>
);
