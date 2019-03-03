import { Socket } from "net";
import { bindNodeCallback, Observable, of } from "rxjs";
import { catchError, filter, mapTo, mergeMap, timeout } from "rxjs/operators";

export type ObservableSocketWrite = (command: string) => Observable<boolean>;
export const createObservableSocketWrite = (
  socket: Socket
): ObservableSocketWrite => (command: string) => {
  const socketWrite = (cmd: string, cb: () => void) =>
    socket.write(cmd, "utf8", cb);
  return new Observable<boolean>((observer) =>
    of(socket)
      .pipe(
        filter(() => !socket.destroyed),
        mergeMap(() => bindNodeCallback(socketWrite)(command)),
        mapTo(true),
        catchError((_) => of(false)),
        filter((sent: boolean) => sent),
        timeout(1000)
      )
      .subscribe(observer)
  );
};
