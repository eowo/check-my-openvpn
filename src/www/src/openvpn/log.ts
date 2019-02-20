import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { test } from "ramda";

export const log: ([read, send]) => Observable<string> = ([read, send]) =>
  Observable.create(observer => {
    send.next("log on\r\n");
    read.pipe(filter(test(/^>LOG:/))).subscribe(observer);
  });
