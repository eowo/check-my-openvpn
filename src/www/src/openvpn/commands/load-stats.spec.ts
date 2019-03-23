import { of, Subject } from "rxjs";
import { loadStats } from "./load-stats";

jest.mock("../get-rx-socket");

describe("load-stats command", () => {
  let read: any;
  let send: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  describe("send", () => {
    it(`should send "load-stats" command`, (done) => {
      send = jest.fn().mockReturnValue(of(true));

      loadStats([read, send]).subscribe({
        complete: () => {
          expect(send).toHaveBeenCalledWith("load-stats");
          done();
        }
      });

      read.complete();
    });
  });

  describe("read", () => {
    it("should collect the message properly", (done) => {
      const RESPONSE = [
        "SUCCESS: nclients=2,bytesin=2837800859,bytesout=28453141396\r"
      ];

      loadStats([read, send]).subscribe({
        next: (response) => {
          expect(response).toEqual({
            bytesin: "2837800859",
            bytesout: "28453141396",
            nclients: "2"
          });
          done();
        }
      });

      RESPONSE.map((row) => read.next(row));
    });
  });
});
