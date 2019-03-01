import { Socket } from "net";
import {
  Observable,
  from,
  fromEvent,
  Subject,
  bindNodeCallback,
  of
} from "rxjs";
import {
  tap,
  scan,
  mapTo,
  filter,
  map,
  mergeMap,
  catchError
} from "rxjs/operators";
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

export type ObservableSocketRead = Observable<string>;
const createObservableSocketRead = (socket: Socket): ObservableSocketRead => {
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

export type ObservableSocketWrite = (command: string) => Observable<boolean>;
const createObservableSocketWrite = (socket: Socket): ObservableSocketWrite => (
  command: string
) => {
  const socketWrite = (cmd: string, cb: () => void) =>
    socket.write(cmd, "utf8", cb);
  return new Observable<boolean>(observer =>
    of(socket)
      .pipe(
        filter(() => !socket.destroyed),
        mergeMap(() => bindNodeCallback(socketWrite)(command)),
        mapTo(true),
        catchError(_ => of(false))
      )
      .subscribe(observer)
  );
};

export const getRxSocket = () => (source: Observable<Socket>) =>
  new Observable<[ObservableSocketRead, ObservableSocketWrite]>(observer =>
    source
      .pipe(
        map(
          converge((read, write) => [read, write], [
            createObservableSocketRead,
            createObservableSocketWrite
          ])
        )
      )
      .subscribe(observer)
  );
