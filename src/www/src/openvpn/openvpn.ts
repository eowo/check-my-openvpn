import { createConnection, Socket } from "net";
import { getRxSocket } from "./get-rx-socket";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { take } from "rxjs/operators";
import { log } from "./log";
import { pid } from "./pid";
import { status } from "./status";
import converge from "ramda/es/converge";

export interface Commands {
  log: Observable<string>;
  pid: Observable<string>;
  status: Observable<string[]>;
}

const getCommands = (
  rxSocket: [Observable<string>, Subject<string>]
): Commands =>
  converge(
    (log, pid, status) => ({
      log,
      pid,
      status
    }),
    [log, pid, status]
  )(rxSocket);

const connect = (storedSocket: ReplaySubject<Socket>) => (
  host: string,
  port: number
) => storedSocket.next(createConnection({ host, port }));

const commands = (
  source: Observable<[Observable<string>, Subject<string>]>
): Observable<Commands> =>
  new Observable(observer =>
    source.subscribe({
      next: rw => observer.next(getCommands(rw))
    })
  );

const storedSocket = new ReplaySubject<Socket>();

export interface OpenVPNConnection {
  connect: (host: string, port: number) => void;
  disconnect: () => void;
}

export const openVpnConnection = (): OpenVPNConnection => ({
  connect: connect(storedSocket),
  disconnect: () =>
    storedSocket.pipe(take(1)).subscribe({
      next: socket => socket.destroy()
    })
});

export const openVpnCommands = (): Observable<Commands> =>
  commands(storedSocket.pipe(getRxSocket));
