import { Subject } from "rxjs";
import { bytecount } from "./bytecount";

jest.mock("../get-rx-socket");

describe("Real-time notification: bytecount", () => {
  let read: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  it("should collect the message properly", (done) => {
    bytecount([read]).subscribe({
      next: (response) => {
        expect(response).toEqual({
          cid: 1173,
          bytesIn: 565028,
          bytesOut: 3336474
        });
        done();
      }
    });

    read.next(">BYTECOUNT_CLI:1173,565028,3336474\r");
  });
});
