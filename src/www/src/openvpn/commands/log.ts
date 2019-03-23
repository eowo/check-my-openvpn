import { test } from "ramda";
import { Observable } from "rxjs";
import { filter, switchMap, take, timeout } from "rxjs/operators";
import { ObservableSocketRead, ObservableSocketWrite } from "../get-rx-socket";

export type logEnable = (on: boolean) => Observable<string>;
export const logEnable: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => logEnable = ([read, send]) => (on: boolean) =>
  new Observable((observer) => {
    const responseRegEx = new RegExp(
      `^SUCCESS: real-time log notification set to ${on ? "ON" : "OFF"}`
    );
    send(`log ${on ? "on" : "off"}`)
      .pipe(
        switchMap(() =>
          read.pipe(
            filter(test(responseRegEx)),
            timeout(2000),
            take(1)
          )
        )
      )
      .subscribe(observer);
  });
