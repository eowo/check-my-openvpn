import * as React from "react";
import { ReplaySubject } from "rxjs";
import { Commands } from "../openvpn";

export interface CommandsContext {
  commandsSource: ReplaySubject<Commands>;
}

export default React.createContext<CommandsContext>({
  commandsSource: new ReplaySubject<Commands>(1)
});
