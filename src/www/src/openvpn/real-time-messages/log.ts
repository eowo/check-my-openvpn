import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { test } from "ramda";
import { ObservableSocketRead } from "../get-rx-socket";

export const log: ([read]: [ObservableSocketRead]) => Observable<string> = ([
  read
]) =>
  new Observable(observer => {
    read.pipe(filter(test(/^>LOG:/))).subscribe(observer);
  });