import { compose, concat, last, test } from "ramda";
import { Observable } from "rxjs";
import { filter, scan, switchMap, take } from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export type version = Observable<string[]>;
export const version: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => version = ([read, send]) =>
  send("version").pipe(
    switchMap(() =>
      read.pipe(
        filter(test(/^OpenVPN Version|Management Version|END/)),
        scan((acc: string[], cur: string): string[] => {
          if (test(/^OpenVPN Version/, cur)) acc = [];
          return concat(acc, [cur]);
        }, []),
        filter(
          compose<string[], string, boolean>(
            test(/END\r$/),
            last
          )
        ),
        take(1)
      )
    )
  );
