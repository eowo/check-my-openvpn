import { Socket } from "net";
import { Observable, from, fromEvent, Subject, bindNodeCallback } from "rxjs";
import { tap, scan, filter, map, mergeMap } from "rxjs/operators";
import {
  compose,
  converge,
  head,
  isEmpty,
  concat,
  last,
  init,
  tail,
  unnest,
  split
} from "ramda";

const isCompletePackage = compose<ReadonlyArray<string>, any, boolean>(
  isEmpty,
  last
);

const collectPackage = (acc: string[], cur: string[]) => {
  if (isCompletePackage(acc)) acc = [];
  return !isEmpty(acc)
    ? unnest([init(acc), [concat(last(acc), head(cur))], tail(cur)])
    : concat(acc, cur);
};

const createObservableSocket: (
  socket: Socket
) => Observable<string> = socket => {
  const observer = new Subject<string>();
  fromEvent(socket, "data")
    .pipe(
      map((data: Uint8Array) => data.toString()),
      tap(console.log),
      map(split(/\n/)),
      scan(collectPackage, []),
      filter(isCompletePackage),
      map((packages: string[]) => init(packages)),
      mergeMap((packages: string[]) => from(packages))
    )
    .subscribe((msg: string) => observer.next(msg));
  fromEvent(socket, "error").subscribe((error: Error) => observer.error(error));
  fromEvent(socket, "close").subscribe((hadError: boolean) =>
    hadError
      ? observer.error("Socket was closed due to a transmission error")
      : observer.complete()
  );

  return observer.asObservable();
};

const createObserverSocket = (socket: Socket) => {
  const socketSubject = new Subject<string>();
  const socketWrite = (cmd: string, cb: () => void) =>
    socket.write(cmd, "utf8", cb);

  socketSubject
    .pipe(
      filter(() => !socket.destroyed),
      mergeMap((cmd: string) => bindNodeCallback(socketWrite)(cmd))
    )
    .subscribe();

  return socketSubject;
};

export const getRxSocket = (source: Observable<Socket>) =>
  new Observable<[Observable<string>, Subject<string>]>(observer =>
    source
      .pipe(
        map(
          converge((read, write) => [read, write], [
            createObservableSocket,
            createObserverSocket
          ])
        )
      )
      .subscribe({
        next([read, write]) {
          observer.next([read, write]);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      })
  );
