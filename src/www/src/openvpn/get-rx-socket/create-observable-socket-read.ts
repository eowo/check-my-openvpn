import { Socket } from "net";
import {
  anyPass,
  compose,
  concat,
  head,
  includes,
  init,
  isEmpty,
  last,
  split,
  tail,
  unnest
} from "ramda";
import { from, fromEvent, Observable, Subject } from "rxjs";
import { filter, map, mergeMap, scan, tap } from "rxjs/operators";

const isInputRequest = (msg: string) => includes(msg, ["ENTER PASSWORD:"]);

const isCompletePackage = compose<ReadonlyArray<string>, any, boolean>(
  anyPass([isEmpty, isInputRequest]),
  last
);

const collectPackage = (acc: string[], cur: string[]) => {
  if (isCompletePackage(acc)) acc = [];
  return !isEmpty(acc)
    ? unnest([init(acc), [concat(last(acc), head(cur))], tail(cur)])
    : concat(acc, cur);
};

const removeEmptyItem = (packages: string[]) =>
  packages.length > 1 ? init(packages) : packages;

export type ObservableSocketRead = Observable<string>;
export const createObservableSocketRead = (
  socket: Socket
): ObservableSocketRead => {
  const observer = new Subject<string>();

  fromEvent(socket, "data")
    .pipe(
      map((data: Buffer) => data.toString()),
      // tslint:disable-next-line
      tap(console.log),
      map(split(/\n/)),
      scan(collectPackage, []),
      filter(isCompletePackage),
      map(removeEmptyItem),
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
