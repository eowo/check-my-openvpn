import { Socket } from "net";
import { bindNodeCallback, Observable, of } from "rxjs";
import { catchError, filter, mapTo, mergeMap, timeout } from "rxjs/operators";

const socketWrite = (socket: Socket) => (cmd: string, cb: () => void) =>
  socket.write(cmd, "utf8", cb);

export type ObservableSocketWrite = (command: string) => Observable<boolean>;
export const createObservableSocketWrite = (
  socket: Socket
): ObservableSocketWrite => (command: string) =>
  of(socket).pipe(
    filter(({ destroyed }: Socket) => !destroyed),
    mergeMap((s: Socket) => bindNodeCallback(socketWrite(s))(command + "\r\n")),
    mapTo(true),
    catchError(() => of(false)),
    filter((sent: boolean) => sent),
    timeout(1000)
  );
