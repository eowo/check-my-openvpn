import { from, of, Subject, TimeoutError } from "rxjs";
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
    });
  });

  describe("read", () => {
    it("should throw TimeoutError after 2000 ms and emit []", (done) => {
      send = jest.fn().mockReturnValue(of(true));
      jest.useFakeTimers();

      status([read, send]).subscribe({
        next: (value) => {
          expect(value).toEqual([]);
          done();
        }
      });

      jest.advanceTimersByTime(2000);
      jest.useRealTimers();
    });
  });
});
