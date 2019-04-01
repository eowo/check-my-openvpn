import { split, test } from "ramda";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ObservableSocketRead } from "../get-rx-socket";

export type bytecount = Observable<{
  cid: number;
  bytesIn: number;
  bytesOut: number;
}>;
export const bytecount: ([read]: [ObservableSocketRead]) => bytecount = ([
  read
]) =>
  read.pipe(
    filter(test(/^>BYTECOUNT_CLI:/)),
    map(split(/:|,|\r/)),
    map(([, cid, bytesIn, bytesOut]) => [
      parseInt(cid, 10),
      parseInt(bytesIn, 10),
      parseInt(bytesOut, 10)
    ]),
    map(([cid, bytesIn, bytesOut]) => ({
      cid,
      bytesIn,
      bytesOut
    }))
  );
