import { createConnection, Socket } from "net";
import { getRxSocket } from "./get-rx-socket";
import {
  Observable,
  fromEvent,
  ReplaySubject,
  of,
  Subscriber,
  throwError,
  race
} from "rxjs";
import {
  take,
  timeout,
  mapTo,
  mergeMap,
  tap,
  catchError
} from "rxjs/operators";
import { Commands, getCommands } from "./get-commands";

const connect = (storedSocket: ReplaySubject<Socket>) => (
  host: string,
  port: number
) =>
  new Observable((observer: Subscriber<Commands>) => {
    of(createConnection({ host, port }))
      .pipe(
        mergeMap((socket: Socket) =>
          race(
            fromEvent<string>(socket, "connect").pipe(
              take(1),
              mapTo(socket),
              timeout(3000),
              catchError(error => {
                socket.destroy();
                return throwError(error);
              })
            ),
            fromEvent<Error>(socket, "error").pipe(
              mergeMap(error => throwError(error))
            )
          )
        ),
        tap((socket: Socket) => storedSocket.next(socket)),
        getRxSocket(),
        getCommands()
      )
      .subscribe(observer);
  });

export interface OpenVPN {
  connect: (host: string, port: number) => Observable<Commands>;
  disconnect: () => void;
}

export const openVpn = (): OpenVPN => {
  const storedSocket = new ReplaySubject<Socket>(1);

  return {
    connect: connect(storedSocket),
    disconnect: () =>
      storedSocket.pipe(take(1)).subscribe({
        next: socket => socket.end()
      })
  };
};
