import { Observable } from "rxjs";
import { filter, map, take, mergeMap } from "rxjs/operators";
import { test, compose, match, last } from "ramda";
import { ObservableSocketWrite, ObservableSocketRead } from "../get-rx-socket";

export const pid: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => Observable<string> = ([read, send]) =>
  new Observable(observer => {
    send("pid\r\n")
      .pipe(
        filter((sent: boolean) => sent),
        mergeMap(() =>
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
      )
      .subscribe(observer);
  });
