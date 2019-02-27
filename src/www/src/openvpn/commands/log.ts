import { Observable } from "rxjs";
import { filter, take, timeout } from "rxjs/operators";
import { test } from "ramda";

export const logEnable: ([read, send]) => (
  on: boolean
) => Observable<string> = ([read, send]) => (on: boolean) =>
  Observable.create(observer => {
    send.next(`log ${on ? "on" : "off"}\r\n`);
    const responseRegEx = new RegExp(
      `^SUCCESS: real-time log notification set to ${on ? "ON" : "OFF"}`
    );
    read
      .pipe(
        filter(test(responseRegEx)),
        timeout(2000),
        take(1)
      )
      .subscribe(observer);
  });
