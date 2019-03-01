import { converge } from "ramda";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { logEnable, pid, status } from "./commands";
import { ObservableSocketRead, ObservableSocketWrite } from "./get-rx-socket";
import { log } from "./real-time-messages";

export interface Commands {
  logEnable: (on: true) => Observable<string>;
  log: Observable<string>;
  pid: Observable<string>;
  status: Observable<string[]>;
}

export const getCommands = () => (
  source: Observable<[ObservableSocketRead, ObservableSocketWrite]>
): Observable<Commands> =>
  new Observable((observer) =>
    source
      .pipe(
        map(
          converge(
            (obsLogEnable, obsPid, obsStatus, obsLog) => ({
              logEnable: obsLogEnable,
              pid: obsPid,
              status: obsStatus,
              log: obsLog
            }),
            [logEnable, pid, status, log]
          )
        )
      )
      .subscribe(observer)
  );
