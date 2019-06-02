import { test } from "ramda";
import { EMPTY, Observable } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { ObservableSocketRead } from "../../get-rx-socket";

// Informational messages such as the welcome message.
export type info = Observable<string>;
export const info: ([read]: [ObservableSocketRead]) => info = ([read]) =>
  read.pipe(
    filter(test(/^>INFO:/)),
    catchError((error: Error) => EMPTY)
  );
