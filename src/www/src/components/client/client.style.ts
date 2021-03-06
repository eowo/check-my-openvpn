import styled from "styled-components";

export const Wrapper = styled.div`
  background: rgba(51, 51, 51, 0.75);
  border: 1px solid #505050;
  box-sizing: border-box;
  display: flex;
  flex: 0 50%;
  flex-basis: calc(50% - 5px);
  flex-direction: row;
  padding: 10px;
  margin-bottom: 10px;
  max-height: fit-content;
`;

export const Info = styled.div`
  flex: 0 50%;
`;

export const Graphs = styled.div`
  flex: 0 50%;
`;
