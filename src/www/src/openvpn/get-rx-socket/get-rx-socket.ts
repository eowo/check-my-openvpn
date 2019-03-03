import { Socket } from "net";
import { converge } from "ramda";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  createObservableSocketRead,
  ObservableSocketRead
} from "./create-observable-socket-read";
import {
  createObservableSocketWrite,
  ObservableSocketWrite
} from "./create-observable-socket-write";

export const getRxSocket = () => (source: Observable<Socket>) =>
  new Observable<[ObservableSocketRead, ObservableSocketWrite]>((observer) =>
    source
      .pipe(
        map(
          converge((read, write) => [read, write], [
            createObservableSocketRead,
            createObservableSocketWrite
          ])
        )
      )
      .subscribe(observer)
  );
