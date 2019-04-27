import { compose, concat, isEmpty, last, match, reduce, test } from "ramda";
import { Observable } from "rxjs";
import { filter, map, scan, switchMap, take } from "rxjs/operators";
import {
  ObservableSocketRead,
  ObservableSocketWrite
} from "../../get-rx-socket";

export type version = Observable<{}>;
export const version: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => version = ([read, send]) =>
  send("version").pipe(
    switchMap(() =>
      read.pipe(
        filter(test(/(^OpenVPN Version|Management Version|END)/)),
        scan((acc: string[], cur: string): string[] => {
          if (test(/^OpenVPN Version/, cur)) acc = [];
          return test(/END\r$/, cur) && isEmpty(acc) ? [] : concat(acc, [cur]);
        }, []),
        filter(
          compose<string[], string, boolean>(
            test(/END\r$/),
            last
          )
        ),
        map(
          reduce(
            (acc, cur: string) => {
              const [, key, value]: string[] = match(
                /(OpenVPN Version|Management Version): (.+)/
              )(cur);
              if (key !== undefined) acc[key] = value;
              return acc;
            },
            {} as { [key: string]: string }
          )
        ),
        take(1)
      )
    )
  );
