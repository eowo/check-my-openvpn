import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { test } from "ramda";

export const log: ([read, send]) => Observable<string> = ([read]) =>
  Observable.create(observer => {
    read.pipe(filter(test(/^>LOG:/))).subscribe(observer);
  });
