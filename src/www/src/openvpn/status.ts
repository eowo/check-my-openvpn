import { Observable, Subject, interval } from "rxjs";
import { filter, scan } from "rxjs/operators";
import { test, concat, compose, last } from "ramda";

export const status: ([read, send]: [
  Observable<string>,
  Subject<string>
]) => Observable<string[]> = ([read, send]) =>
  new Observable(observer => {
    interval(1000).subscribe({ next: () => send.next("status 2\r\n") });
    read
      .pipe(
        filter(
          test(
            /^(TITLE|TIME|HEADER|CLIENT_LIST|ROUTING_TABLE|GLOBAL_STATS|END)/
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
        )
      )
      .subscribe(observer);
  });
