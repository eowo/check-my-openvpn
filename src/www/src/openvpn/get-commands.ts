import { converge } from "ramda";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { bytecountRequest, logEnable, pid, status, version } from "./commands";
import { ObservableSocketRead, ObservableSocketWrite } from "./get-rx-socket";
import { bytecount, log } from "./real-time-messages";

export interface Commands {
  logEnable: logEnable;
  bytecountRequest: bytecountRequest;
  bytecount: bytecount;
  log: log;
  pid: pid;
  status: status;
  version: version;
}

export const getCommands = () => (
  source: Observable<[ObservableSocketRead, ObservableSocketWrite]>
): Observable<Commands> =>
  source.pipe(
    map(
      converge(
        (
          obsLogEnable,
          obsPid,
          obsStatus,
          obsLog,
          obsBytecountRequest,
          obsBytecount,
          obsVersion
        ) => ({
          logEnable: obsLogEnable,
          pid: obsPid,
          status: obsStatus,
          log: obsLog,
          bytecountRequest: obsBytecountRequest,
          bytecount: obsBytecount,
          version: obsVersion
        }),
        [logEnable, pid, status, log, bytecountRequest, bytecount, version]
      )
    )
  );
