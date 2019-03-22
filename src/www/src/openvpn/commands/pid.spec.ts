import { of, Subject } from "rxjs";
import { pid } from "./pid";

jest.mock("../get-rx-socket");

describe("pid command", () => {
  let read: any;
  let send: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  describe("send", () => {
    it(`should send "pid\\r\\n" command`, (done) => {
      send = jest.fn().mockReturnValue(of(true));

      pid([read, send]).subscribe({
        complete: () => {
          expect(send).toHaveBeenCalledWith("pid\r\n");
          done();
        }
      });

      read.complete();
    });
  });

  describe("read", () => {
    it("should collect the message properly", (done) => {
      const RESPONSE = ["SUCCESS: pid=2545\r"];

      pid([read, send]).subscribe({
        next: (response) => {
          expect(response).toEqual("2545");
          done();
        }
      });

      RESPONSE.map((row) => read.next(row));
    });
  });
});
