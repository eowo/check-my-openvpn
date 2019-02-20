import { Socket } from "net";
import { Observable, from, Observer, fromEvent, Subject, race } from "rxjs";
import { tap, scan, filter, map, mergeMap, mapTo } from "rxjs/operators";
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

const createObservableSocket: (socket: Socket) => Observable<string> = socket =>
  Observable.create((observer: Observer<string | Error>) => {
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
    fromEvent(socket, "error").subscribe((error: Error) =>
      observer.error(error)
    );
    fromEvent(socket, "close").subscribe((hadError: boolean) =>
      hadError
        ? observer.error("Socket was closed due to a transmission error")
        : observer.complete()
    );
  });

const createObserverSocket = (socket: Socket) => {
  const s = new Subject<string>();
  s.subscribe({ next: cmd => socket.write(cmd) });
  return s;
};

export const getRxSocket = (source: Observable<Socket>) =>
  new Observable<[Observable<string>, Subject<string>]>(observer =>
    source
      .pipe(
        filter(socket => socket !== undefined),
        mergeMap(socket =>
          race(
            fromEvent<string>(socket, "connect").pipe(mapTo(socket)),
            fromEvent<Error>(socket, "error").pipe(mapTo(undefined))
          )
        ),
        filter((socket: Socket | undefined) => socket !== undefined),
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
