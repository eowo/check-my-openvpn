import { createConnection, Socket } from "net";
import {
  fromEvent,
  merge,
  Observable,
  of,
  race,
  ReplaySubject,
  throwError
} from "rxjs";
import {
  catchError,
  mapTo,
  mergeMap,
  switchMap,
  take,
  tap,
  timeout
} from "rxjs/operators";
import { Commands, getCommands } from "./get-commands";
import { getRxSocket } from "./get-rx-socket";

const connect = (storedSocket: ReplaySubject<Socket>) => (
  host: string,
  port: number
) =>
  of(createConnection({ host, port })).pipe(
    mergeMap((socket: Socket) =>
      race(
        fromEvent<string>(socket, "connect").pipe(
          take(1),
          mapTo(socket),
          timeout(3000),
          catchError((error) => {
            socket.destroy();
            return throwError(error);
          })
        ),
        fromEvent<Error>(socket, "error").pipe(
          mergeMap((error) => throwError(error))
        )
      )
    ),
    tap((socket: Socket) => storedSocket.next(socket)),
    getRxSocket(),
    getCommands()
  );

export interface OpenVPN {
  connect: (host: string, port: number) => Observable<Commands>;
  disconnect: () => void;
  events: Observable<{ error?: Error; closed: boolean }>;
}

const errorOrCloseEvents = (srcSocket: Observable<Socket>) =>
  srcSocket.pipe(
    switchMap((socket) =>
      merge(
        fromEvent(socket, "error").pipe(
          mergeMap((error: Error) => of({ error, closed: false }))
        ),
        fromEvent(socket, "close").pipe(
          mergeMap((hadError: boolean) =>
            hadError
              ? of({
                  error: Error("Socket was closed due to a transmission error"),
                  closed: true
                })
              : of({ closed: true })
          )
        )
      )
    )
  );

export const openVpn = (): OpenVPN => {
  const storedSocket = new ReplaySubject<Socket>(1);

  return {
    connect: connect(storedSocket),
    disconnect: () =>
      storedSocket.pipe(take(1)).subscribe({
        next: (socket) => socket.destroy()
      }),
    events: errorOrCloseEvents(storedSocket)
  };
};
