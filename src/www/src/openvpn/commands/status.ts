import { Observable, TimeoutError, of, throwError } from "rxjs";
import {
  filter,
  mergeMap,
  scan,
  take,
  timeout,
  catchError
} from "rxjs/operators";
import { test, concat, compose, last } from "ramda";
import { ObservableSocketWrite, ObservableSocketRead } from "../get-rx-socket";

export const status: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => Observable<string[]> = ([read, send]) =>
  new Observable(observer => {
    send("status 2\r\n")
      .pipe(
        filter((sent: boolean) => sent),
        mergeMap(() =>
          read.pipe(
            filter(
              test(
                /^TITLE|TIME|HEADER|CLIENT_LIST|ROUTING_TABLE|GLOBAL_STATS|END/
              )
            ),
            scan((acc: string[], cur: string): string[] => {
              if (test(/^TITLE/, cur)) acc = [];
              return concat(acc, [cur]);
            }, []),
            filter(
              compose<string[], string, boolean>(
                test(/END\r$/),
                last
              )
            ),
            take(1),
            timeout(1000),
            catchError((error: Error) =>
              error instanceof TimeoutError ? of([]) : throwError(error)
            )
          )
        )
      )
      .subscribe(observer);
  });
