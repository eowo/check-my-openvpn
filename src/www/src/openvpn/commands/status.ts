import { compose, concat, last, test } from "ramda";
import { Observable, of, throwError, TimeoutError } from "rxjs";
import {
  catchError,
  filter,
  mergeMap,
  scan,
  take,
  timeout
} from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export const status: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => Observable<string[]> = ([read, send]) =>
  new Observable((observer) => {
    send("status 2\r\n")
      .pipe(
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
            timeout(2000),
            catchError((error: Error) => {
              return error instanceof TimeoutError ? of([]) : throwError(error);
            })
          )
        )
      )
      .subscribe(observer);
  });
