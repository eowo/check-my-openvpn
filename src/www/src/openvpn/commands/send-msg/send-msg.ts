import { Observable } from "rxjs";
import {
  ObservableSocketRead,
  ObservableSocketWrite
} from "../../get-rx-socket";

export type sendMsg = (str: string) => Observable<boolean>;

// sendMsg is used to transmit a message to the socket
export const sendMsg: ([, send]: [
  ObservableSocketRead,
  ObservableSocketWrite
]) => sendMsg = ([, send]) => (str: string) => send(str);
