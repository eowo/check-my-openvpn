import styled from "styled-components";

export const Wrapper = styled.dl`
  flex: 1;
  margin-bottom: auto;
  background: rgba(51, 51, 51, 0.75);
  border: 1px solid #505050;
  box-sizing: border-box;
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-wrap: wrap;
  text-align: left;
  line-height: 1.8em;
  min-height: fit-content;
  max-height: fit-content;
`;

export const P = styled.dt`
  width: 10%;
`;

export const V = styled.dd`
  width: 90%;
  margin: 0;
  color: #aaa;
  font-weight: 400;
`;
