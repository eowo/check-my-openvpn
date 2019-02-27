import { Observable, Subject } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { test, compose, match, last } from "ramda";

export const pid: ([read, send]: [
  Observable<string>,
  Subject<string>
]) => Observable<string> = ([read, send]) =>
  new Observable(observer => {
    send.next("pid\r\n");
    read
      .pipe(
        filter(test(/^SUCCESS: pid=/)),
        map(
          compose<string, string[], string>(
            last,
            match(/pid=(\d*)/)
          )
        ),
        take(1)
      )
      .subscribe(observer);
  });
