import { test } from "ramda";
import { Observable } from "rxjs";
import { filter, mapTo, switchMap, take, timeout } from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export type bytecountRequest = (n: number) => Observable<boolean>;
export const bytecountRequest: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => bytecountRequest = ([read, send]) => (n: number) =>
  send(`bytecount ${n}`).pipe(
    switchMap(() =>
      read.pipe(
        filter(test(/^SUCCESS: bytecount interval changed/)),
        // timeout(2000),
        take(1),
        mapTo(true)
      )
    )
  );
