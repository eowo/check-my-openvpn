import {
  compose,
  concat,
  fromPairs,
  head,
  match,
  of,
  reduce,
  split,
  test
} from "ramda";
import { Observable } from "rxjs";
import { filter, map, switchMap, take } from "rxjs/operators";
import {
  ObservableSocketRead,
  ObservableSocketWrite
} from "../../get-rx-socket";

export type loadStats = Observable<{ [key: string]: any }>;
export const loadStats: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => loadStats = ([read, send]) =>
  send("load-stats").pipe(
    switchMap(() =>
      read.pipe(
        filter(test(/^SUCCESS: nclients=/)),
        map(
          compose<
            string,
            string[],
            string,
            string[],
            string[][],
            { [key: string]: any }
          >(
            fromPairs,
            reduce(
              (acc, cur: string) =>
                compose(
                  concat(acc),
                  of,
                  split("=")
                )(cur),
              []
            ),
            split(","),
            head,
            match(/nclients=(\d*),bytesin=(\d*),bytesout=(\d*)/)
          )
        ),
        take(1)
      )
    )
  );
