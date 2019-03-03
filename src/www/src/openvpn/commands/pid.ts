import { compose, last, match, test } from "ramda";
import { Observable } from "rxjs";
import { filter, map, mergeMap, take } from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export const pid: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => Observable<string> = ([read, send]) =>
  new Observable((observer) => {
    send("pid\r\n")
      .pipe(
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
