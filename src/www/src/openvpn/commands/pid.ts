import { compose, last, match, test } from "ramda";
import { Observable } from "rxjs";
import { filter, map, switchMap, take } from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export type pid = Observable<string>;
export const pid: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => pid = ([read, send]) =>
  send("pid").pipe(
    switchMap(() =>
      read.pipe(
        filter(test(/^SUCCESS: pid=/)),
        map(
          compose<string, string[], string>(
            last,
            match(/pid=(\d*)/)
          )
        ),
        take(1)
      )
    )
  );
