import { Socket } from "net";
import {
  compose,
  concat,
  head,
  init,
  isEmpty,
  last,
  split,
  tail,
  unnest
} from "ramda";
import { from, fromEvent, Observable, Subject } from "rxjs";
import { filter, map, mergeMap, scan, tap } from "rxjs/operators";

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
export const createObservableSocketRead = (
  socket: Socket
): ObservableSocketRead => {
  const observer = new Subject<string>();
  fromEvent(socket, "data")
    .pipe(
      map((data: Uint8Array) => data.toString()),
      // tslint:disable-next-line
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
