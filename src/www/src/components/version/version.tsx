import * as React from "react";
import { version } from "../../../package.json";
import { Wrapper } from "./version.style";

export function Version() {
  return <Wrapper>v{version}</Wrapper>;
}
