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
    read = new Subject<string[]>();
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

  describe("read", () => {
    it("should collect the message properly", (done) => {
      const MIXED_RESPONSE = [
        "OTHER_CMD_RESPONSE: ...\r",
        "END\r",
        "TITLE,...\r",
        "TIME,...\r",
        "HEADER,...\r",
        "CLIENT_LIST,...\r",
        "HEADER,...\r",
        "ROUTING_TABLE,...\r",
        "GLOBAL_STATS,...\r",
        "END\r"
      ];

      status([read, send]).subscribe({
        next: (response) => {
          expect(response).toEqual([
            "TITLE,...\r",
            "TIME,...\r",
            "HEADER,...\r",
            "CLIENT_LIST,...\r",
            "HEADER,...\r",
            "ROUTING_TABLE,...\r",
            "GLOBAL_STATS,...\r",
            "END\r"
          ]);
          done();
        }
      });

      MIXED_RESPONSE.map((row) => read.next(row));
    });
  });
});
