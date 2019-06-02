import { test } from "ramda";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ObservableSocketRead } from "../../get-rx-socket";

export enum STATES {
  REQUEST,
  SUCCESS
}

export type managementPassword = Observable<STATES>;
export const managementPassword: ([read]: [
  ObservableSocketRead
]) => managementPassword = ([read]) =>
  read.pipe(
    filter(test(/^ENTER PASSWORD:|^SUCCESS: password is correct/)),
    map((msg: string) =>
      msg === "ENTER PASSWORD:" ? STATES.REQUEST : STATES.SUCCESS
    )
  );
