import { test } from "ramda";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { ObservableSocketRead } from "../get-rx-socket";

export type bytecount = Observable<string>;
export const bytecount: ([read]: [ObservableSocketRead]) => bytecount = ([
  read
]) =>
  new Observable((observer) => {
    read.pipe(filter(test(/^>BYTECOUNT_CLI:/))).subscribe(observer);
  });
