import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { converge } from "ramda";
import { logEnable, status, pid } from "./commands";
import { log } from "./real-time-messages";
import { ObservableSocketWrite, ObservableSocketRead } from "./get-rx-socket";

export interface Commands {
  logEnable: (on: true) => Observable<string>;
  log: Observable<string>;
  pid: Observable<string>;
  status: Observable<string[]>;
}

export const getCommands = () => (
  source: Observable<[ObservableSocketRead, ObservableSocketWrite]>
): Observable<Commands> =>
  new Observable(observer =>
    source
      .pipe(
        map(
          converge(
            (logEnable, pid, status, log) => ({
              logEnable,
              pid,
              status,
              log
            }),
            [logEnable, pid, status, log]
          )
        )
      )
      .subscribe(observer)
  );
