import { Subject } from "rxjs";
import { log } from "./log";

jest.mock("../../get-rx-socket");

describe("Real-time notification: log", () => {
  let read: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  it("should collect the message properly", (done) => {
    log([read]).subscribe({
      next: (response) => {
        expect(response).toBe(">LOG: message\r");
        done();
      }
    });

    read.next(">LOG: message\r");
  });

  it("should catch the error", (done) => {
    log([read]).subscribe({
      next: () => {
        done.fail("should not be called");
      },
      complete: () => done()
    });

    read.error(new Error("error"));
    read.next(">LOG: message\r");
  });
});
