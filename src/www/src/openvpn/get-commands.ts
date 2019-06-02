import { converge } from "ramda";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  bytecountRequest,
  loadStats,
  logEnable,
  pid,
  sendMsg,
  status,
  version
} from "./commands";
import { ObservableSocketRead, ObservableSocketWrite } from "./get-rx-socket";
import { bytecount, info, log, managementPassword } from "./real-time-messages";

export interface Commands {
  logEnable: logEnable;
  bytecountRequest: bytecountRequest;
  bytecount: bytecount;
  log: log;
  info: info;
  pid: pid;
  status: status;
  version: version;
  loadStats: loadStats;
  managementPassword: managementPassword;
  sendMsg: sendMsg;
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
          obsVersion,
          obsLoadStats,
          obsManagementPassword,
          obsInfo,
          obsSendMsg
        ) => ({
          logEnable: obsLogEnable,
          pid: obsPid,
          status: obsStatus,
          log: obsLog,
          bytecountRequest: obsBytecountRequest,
          bytecount: obsBytecount,
          version: obsVersion,
          loadStats: obsLoadStats,
          managementPassword: obsManagementPassword,
          info: obsInfo,
          sendMsg: obsSendMsg
        }),
        [
          logEnable,
          pid,
          status,
          log,
          bytecountRequest,
          bytecount,
          version,
          loadStats,
          managementPassword,
          info,
          sendMsg
        ]
      )
    )
  );
