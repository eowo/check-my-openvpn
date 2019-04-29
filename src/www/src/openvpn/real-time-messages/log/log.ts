import { split, test } from "ramda";
import { EMPTY, Observable } from "rxjs";
import { catchError, filter, map } from "rxjs/operators";
import { ObservableSocketRead } from "../../get-rx-socket";

export interface LogItem {
  time: string;
  flag: string;
  message: string;
}

export type log = Observable<LogItem>;
export const log: ([read]: [ObservableSocketRead]) => log = ([read]) =>
  read.pipe(
    filter(test(/^>LOG:/)),
    map(split(/>LOG:|,|\r/)),
    map(([, time, flag, message]) => ({
      time: new Date(parseInt(time, 10) * 1000).toISOString(),
      flag,
      message
    })),
    catchError((error: Error) => EMPTY)
  );
