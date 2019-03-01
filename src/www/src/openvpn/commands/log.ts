import { Observable } from "rxjs";
import { filter, take, mergeMap, timeout } from "rxjs/operators";
import { test } from "ramda";
import { ObservableSocketWrite, ObservableSocketRead } from "../get-rx-socket";

export const logEnable: ([read, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => (on: boolean) => Observable<string> = ([read, send]) => (on: boolean) =>
  new Observable(observer => {
    const responseRegEx = new RegExp(
      `^SUCCESS: real-time log notification set to ${on ? "ON" : "OFF"}`
    );
    send(`log ${on ? "on" : "off"}\r\n`)
      .pipe(
        filter((sent: boolean) => sent),
        mergeMap(() =>
          read.pipe(
            filter(test(responseRegEx)),
            timeout(2000),
            take(1)
          )
        )
      )
      .subscribe(observer);
  });