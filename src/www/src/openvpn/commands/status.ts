import { compose, concat, isEmpty, last, test } from "ramda";
import { Observable } from "rxjs";
import { filter, scan, switchMap, take } from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export type status = Observable<string[]>;
export const status: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => status = ([read, send]) =>
  send("status 2\r\n").pipe(
    switchMap(() =>
      read.pipe(
        filter(
          test(/^TITLE|TIME|HEADER|CLIENT_LIST|ROUTING_TABLE|GLOBAL_STATS|END/)
        ),
        scan((acc: string[], cur: string): string[] => {
          if (test(/^TITLE/, cur)) acc = [];
          return test(/END\r$/, cur) && isEmpty(acc) ? [] : concat(acc, [cur]);
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
