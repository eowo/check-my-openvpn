import { of, Subject } from "rxjs";
import { status } from "./status";

jest.mock("../get-rx-socket");

describe("status command", () => {
  let read: any;
  let send: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string>();
  });

  describe("send", () => {
    it(`should send "status 2\\r\\n" command`, (done) => {
      send = jest.fn().mockReturnValue(of(true));

      status([read, send]).subscribe({
        complete: () => {
          expect(send).toHaveBeenCalledWith("status 2\r\n");
          done();
        }
      });

      read.complete();
    });
  });
});
