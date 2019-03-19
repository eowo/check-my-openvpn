import { test } from "ramda";
import { EMPTY, Observable } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { ObservableSocketRead } from "../get-rx-socket";

export type log = Observable<string>;
export const log: ([read]: [ObservableSocketRead]) => log = ([read]) =>
  new Observable((observer) => {
    read
      .pipe(
        filter(test(/^>LOG:/)),
        catchError((error: Error) => EMPTY)
      )
      .subscribe(observer);
  });
